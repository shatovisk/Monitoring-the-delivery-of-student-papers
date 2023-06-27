const ApiError = require('../exceptions/api-error');
const { teacher_studentGroup, User, studentGroup, studentLesson, teacher} = require('../models/user-model');
const bcrypt = require('bcrypt');
const mailService = require('./mail-service');
const TeacherDto = require('../dtos/teacher-dto');
const tokenService = require('./token-service');
const uuid = require('uuid');
const { where } = require('sequelize');

class TeacherService{
    async registration(email, password, name) {
        const candidate_email = await teacher.findOne({where: {email: `${email}`}})
        if (candidate_email) {
            throw ApiError.BadRequest(`Пользователь с таким email ${email} уже существует`)
        }

        var rx = /^[а-яё\s-]+$/i;
        if (!rx.test(name)){
            throw ApiError.BadRequest(`В имени пользователя могут содержаться только буквы русского алфавита, пробелы и тире`)
        }

        const hashPassword = await bcrypt.hash(password, 3)
        const activationLink = uuid.v4()

        const user = await teacher.create({email: `${email}`, password: `${hashPassword}`, activationLink: `${activationLink}`, name: `${name}`})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/teacher/activate/${activationLink}`)

        const teacherDto = new TeacherDto(user) // id, email, isActivated, name
        const tokens = tokenService.generateTokens({...teacherDto})
        await tokenService.saveToken(teacherDto.id, tokens.refreshToken)

        return{
            ...tokens,
            teacher: teacherDto
        }
    }

    async activate(activationLink){
        const user = await teacher.findOne({where: {activationLink: `${activationLink}`}})
        if (!user){
            throw ApiError.BadRequest('Неккоректная ссылка активации')
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password){
        const teacher_email = await teacher.findOne({where: {email: `${email}`}})

        if (!teacher_email){
            throw ApiError.BadRequest('Пользователя с такой электронной почтой не существует');
        }

        const isPassEquals = await bcrypt.compare(password, teacher_email.password)

        if (!isPassEquals) {
            throw ApiError.BadRequest("Неверный пароль")
        }

        if (teacher_email.isActivated == "false") {
            throw ApiError.BadRequest("Аккаунт не активирован. Пожалуйста, перейдите по ссылке, отправленную вам в письме на почту")
        }

        const teacherDto = new TeacherDto(teacher_email)

        const tokens = tokenService.generateTokens({...teacherDto})

        await tokenService.saveToken(teacherDto.id, tokens.refreshToken)

        return {
            ...tokens,
            teacher: teacherDto
        }
    }


    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken)
        return token
    }


    async refresh(refreshToken) {
        if (!refreshToken){
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb){
            throw ApiError.UnauthorizedError();
        }

        const user = await teacher.findByPk(userData.id)
        const teacherDto = new TeacherDto(user)

        const tokens = tokenService.generateTokens({...teacherDto})
        
        await tokenService.saveToken(teacherDto.id, tokens.refreshToken)
        return {
            ...tokens,
            teacher: teacherDto
        }
    }

    async getGroupId(teacherId){
        const groupId = await teacher_studentGroup.findAll({where: {teacherId: `${teacherId}`}})

        return groupId
    }

    async getGroup(groupID) {
        const group = await studentGroup.findByPk(groupID)

        return group
    }

    async getStudentByGroup(groupId) {
        const students = await User.findAll({where: {studentGroupId: `${groupId}`}})

        return students
    }

    async addLesson(studentGroupId, teacherId, nameLesson) {
        const cheack_lesson = await studentLesson.findOne({where: {studentGroupId: `${studentGroupId}`, teacherId: `${teacherId}`, nameLesson: `${nameLesson}`}})
        if (cheack_lesson){
            throw ApiError.BadRequest("Данному учителю уже назначен этот урок")
        }

        const cheack_group = await teacher_studentGroup.findOne({where: {studentGroupId: `${studentGroupId}`, teacherId: `${teacherId}`}})
        if (!cheack_group){
            const group = await teacher_studentGroup.create({studentGroupId: `${studentGroupId}`, teacherId: `${teacherId}`})
        }

        const lesson = await studentLesson.create({studentGroupId: `${studentGroupId}`, teacherId: `${teacherId}`, nameLesson: `${nameLesson}`})

        return lesson
    }

    async delLesson(studentGroupId, nameLesson) {
        const cheack_teacher = await studentLesson.findOne({where: {studentGroupId: `${studentGroupId}`, nameLesson: `${nameLesson}`}})
        const count_teachers_lesson = await studentLesson.findAll({where: {studentGroupId: `${studentGroupId}`, teacherId: `${cheack_teacher.teacherId}`}})
        if (count_teachers_lesson.length == 1) {
            const del_connect_teacher_group = await teacher_studentGroup.destroy({where: {teacherId: `${cheack_teacher.teacherId}`, studentGroupId: `${studentGroupId}`}})
        }

        const lesson = await studentLesson.destroy({where: {studentGroupId: `${studentGroupId}`, nameLesson: `${nameLesson}`}})

        return lesson
    }

    async updateLesson(studentGroupId, teacherId, nameLesson){
        const cheack_teacher = await studentLesson.findOne({where: {studentGroupId: `${studentGroupId}`, nameLesson: `${nameLesson}`}})
        const count_teachers_lesson = await studentLesson.findAll({where: {studentGroupId: `${studentGroupId}`, teacherId: `${cheack_teacher.teacherId}`}})
        if (count_teachers_lesson.length == 1) {
            const del_connect_teacher_group = await teacher_studentGroup.destroy({where: {teacherId: `${cheack_teacher.teacherId}`, studentGroupId: `${studentGroupId}`}})
        }

        const cheack_lesson = await studentLesson.findOne({where: {studentGroupId: `${studentGroupId}`, teacherId: `${teacherId}`, nameLesson: `${nameLesson}`}})
        if (cheack_lesson){
            throw ApiError.BadRequest("Данному учителю уже назначен этот урок")
        }

        const cheack_group = await teacher_studentGroup.findOne({where: {studentGroupId: `${studentGroupId}`, teacherId: `${teacherId}`}})
        if (!cheack_group){
            const group = await teacher_studentGroup.create({studentGroupId: `${studentGroupId}`, teacherId: `${teacherId}`})
        }

        const updateData = await studentLesson.update({teacherId: `${teacherId}`}, {where: {studentGroupId: `${studentGroupId}`, nameLesson: `${nameLesson}`}})

        return updateData
    }

    async getLesson(studentGroupId){
        const lessons = await studentLesson.findAll({where: {studentGroupId: `${studentGroupId}`}})

        return lessons
    }


    async addGroup(nameGroup){
        const group = await studentGroup.create({nameGroup: `${nameGroup}`})

        return group
    }

    async delGroup(nameGroup) {
        const group = await studentGroup.destroy({where: {nameGroup: `${nameGroup}`}})

        return group
    }

    async getAllGroups() {
        const groups = await  studentGroup.findAll()

        return groups
    }


    async getAllTeacher() {
        const teachers = await teacher.findAll({where: {role: `${"TEACHER"}`}})
        
        return teachers
    }

    async delTeacher(teacherId) {
        const teachers = await teacher.destroy({where: {id: `${teacherId}`}})
        const lessons = await studentLesson.destroy({where: {teacherId: `${teacherId}`}})
        const groups = await teacher_studentGroup.destroy({where: {teacherId: `${teacherId}`}})

        return {
            teacher: teachers,
            lesson: lessons,
            group: groups
        }
    }

}


module.exports = new TeacherService()