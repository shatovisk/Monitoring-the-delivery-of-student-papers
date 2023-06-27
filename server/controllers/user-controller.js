const userService = require('../service/user-service');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');

class UserController{
    async registrtion(req, res, next){
        try {
            const erorrs = validationResult(req);
            if (!erorrs.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации', erorrs.array()))
            }
            const {email, studentCardNumber, password, studentGroup, nameStudent} = req.body;
            const userData = await userService.registratin(email, password, studentCardNumber, studentGroup, nameStudent);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (error) {
            next(error);
        }
    }
    
    async login(req, res, next){
        try {
            const {studentCardNumber, password} = req.body;
            const userData = await userService.login(studentCardNumber, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (error) {
            next(error);
        }
    }

    
    async logout(req, res, next){
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token)
        } catch (error) {
            next(error);
        }
    }

    async activate(req, res, next){
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL)
        } catch (error) {
            next(error);
        }
    }

    
    async refresh(req, res, next){
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (error) {
            next(error);
        }
    }


    async getUsers(req, res, next){
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        } catch (error) {
            next(error);
        }
    }

}



module.exports = new UserController()