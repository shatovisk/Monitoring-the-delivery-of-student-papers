const {User, studentFiles, studentGroup} = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
const path = require('path');
const { dirname } = require('path');

class UserService{
    async registratin(email, password, studentCardNumber, nameGroup, nameStudent){
        const candidate_email = await User.findOne({where: { email: `${email}`}})
        const candidate_studentCardNumber = await User.findOne({where: { studentCardNumber: `${studentCardNumber}`}})
        if (candidate_email){
            throw ApiError.BadRequest(`Пользователь с таким email ${email} уже существует`)
        }
        if (candidate_studentCardNumber){
            throw ApiError.BadRequest(`Пользователь с таким номером студенческого билета ${studentCardNumber} уже существует`)
        }

        var rx = /^[а-яё\s-]+$/i;
        if (!rx.test(nameStudent)){
            throw ApiError.BadRequest(`В имени пользователя могут содержаться только буквы русского алфавита, пробелы и тире`)
        }



        nameGroup = nameGroup.toUpperCase()
        const candidate_group = await studentGroup.findOne({where : {nameGroup: `${nameGroup}`}})
        if (!candidate_group){
            throw ApiError.BadRequest(`Группы ${nameGroup} не существует`)
        } 


        const hashPassword = await bcrypt.hash(password, 3)
        const activationLink = uuid.v4() // c23c-1234f-asf23-sa-asd
        

        
        const user = await User.create({email: `${email}`, studentCardNumber: `${studentCardNumber}`, password: `${hashPassword}`, activationLink: `${activationLink}`, studentGroupId: `${candidate_group.id}`, nameStudent: `${nameStudent}`})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/student/activate/${activationLink}`)

        const userDto = new UserDto(user); //id, email, isActivated, studentCardNumber
        console.log(userDto);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return{
            ...tokens,
            user: userDto
        }
    }

    async activate(activationLink){
        const user = await User.findOne({where: {activationLink: `${activationLink}`}})
        if (!user){
            throw ApiError.BadRequest('Неккоректная ссылка активации')
        }
        user.isActivated = true;
        await user.save();
    }

    async login(studentCardNumber, password) {
        const user_studentCardNumber = await User.findOne({where: {studentCardNumber: `${studentCardNumber}`}});
        
        

        if (!user_studentCardNumber){
            throw ApiError.BadRequest('Пользователя с таким студенческим билетом не существует');
        }

        const isPassEquals = await bcrypt.compare(password, user_studentCardNumber.password)
        

        if (!isPassEquals) {
            throw ApiError.BadRequest("Неверный пароль")
        }

        if (user_studentCardNumber.isActivated == "false") {
            throw ApiError.BadRequest("Аккаунт не активирован. Пожалуйста, перейдите по ссылке, отправленную вам в письме на почту")
        }

        const userDto = new UserDto(user_studentCardNumber)
        
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens, 
            user: userDto}
    }

    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken){
        if (!refreshToken){
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb){
            throw ApiError.UnauthorizedError();
        }

        const user = await User.findByPk(userData.id)
        const userDto = new UserDto(user)
        
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async getAllUsers(){
        const users = User.findAll();
        return users;
    }


    // //studentLessonId хардкодится 
    // async uploadFile(nameFile, studentCardNumber, studentLessonId){
    //     // const filePath = `${req.file.destination}/${req.file.filename}`
    //     // const {studentCardNumber} = req.body;
    //     // const student = await User.findOne({where: { studentCardNumber: `${studentCardNumber}`}})
    //     // const studentFiles = await studentFiles.create({nameFile: `${filePath}`, user_id: `${student.id}`})
    //     // return studentFiles;

    //     console.log(("CARD", studentCardNumber));
    //     let filename = nameFile.name
    //     nameFile.mv(path.resolve(__dirname, '..', 'files', filename))
    //     const student = await User.findOne({where: { studentCardNumber: `${studentCardNumber}`}})
    //     console.log(("STUDENT", student));
    //     const file = await studentFiles.create({nameFile: `${filename}`, UserId: `${student.id}`, studentLessonId: `${studentLessonId}`})
    //     return file
    // }
}

module.exports = new UserService();