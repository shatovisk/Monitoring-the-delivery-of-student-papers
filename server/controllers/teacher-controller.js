const { validationResult } = require("express-validator")
const ApiError = require("../exceptions/api-error");
const teacherService = require("../service/teacher-service");
const { teacher } = require("../models/user-model");
const tokenService = require("../service/token-service");


class TeacherController{
    async registration(req, res, next){
        try {
            const erorrs = validationResult(req)
            if (!erorrs.isEmpty()){
                return next(ApiError.BadRequest("Ошибка при валидации", erorrs.array()))
            }
            const {email, password, name} = req.body;
            const userData = await teacherService.registration(email, password, name)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }

    async activate(req, res, next){
        try {
            const activationLink = req.params.link
            await teacherService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL)
        } catch (error) {
            next(error)
        }
    }

    async login(req, res, next){
        try {
            const {email, password} = req.body
            const teacherData = await teacherService.login(email, password)
            res.cookie('refreshToken', teacherData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(teacherData)
        } catch (error) {
            next(error)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await teacherService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token) 
        } catch (error) {
            next(error)
        }
    }

    async refresh(req, res, next){
        try {
            const {refreshToken} = req.cookies;
            const userData = await teacherService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }

    async getGroupId(req, res, next){
        try {
            const {id} = req.query
            const teacher_group_id = await teacherService.getGroupId(id)
            return res.json(teacher_group_id)
        } catch (error) {
            next(error)
        }
    }

    async getGroup(req, res, next){
        try {
            const {groupId} = req.query
            const teacher_group = await teacherService.getGroup(groupId)
            return res.json(teacher_group)
        } catch (error) {
            next(error)
        }
    }

    async getStudentsByGroup(req, res, next) {
        try {
            const {studentGroupId} = req.query
            const students = await teacherService.getStudentByGroup(studentGroupId)
            return res.json(students)
        } catch (error) {
            next(error)
        }
    }

    async addLesson(req, res, next) {
        try {
            const {studentGroupId, teacherId, nameLesson} = req.body
            const lesson = await teacherService.addLesson(studentGroupId, teacherId, nameLesson)
            return res.json(lesson)
        } catch (error) {
            next(error)
        }
    }

    async delLesson(req, res, next) {
        try {
            const {studentGroupId, nameLesson} = req.query
            const lesson = await teacherService.delLesson(studentGroupId, nameLesson)
            return res.json(lesson)
        } catch (error) {
            next(error)
        }
    }

    async updateLesson(req, res, next) {
        try {
            const {studentGroupId, teacherId, nameLesson} = req.body
            const lesson = await teacherService.updateLesson(studentGroupId, teacherId, nameLesson)
            return res.json(lesson)
        } catch (error) {
            next(error)
        }
    }

    async getLesson(req, res, next){
        try {
            const {studentGroupId} = req.query
            const lessons = await teacherService.getLesson(studentGroupId)
            return res.json(lessons)
        } catch (error) {
            next(error)
        }
    }

    async addGroup(req, res, next) {
        try {
            const {nameGroup} = req.body
            const group = await teacherService.addGroup(nameGroup)
            return res.json(group)
        } catch (error) {
            next(error)
        }
    }

    async delGroup(req, res, next) {
        try {
            const {nameGroup} = req.query
            const group = await teacherService.delGroup(nameGroup)
            return res.json(group)
        } catch (error) {
            next(error)
        }
    }

    async getAllGroups(req, res, next) {
        try {
            const groups = await teacherService.getAllGroups()
            return res.json(groups)                
        } catch (error) {
            next(error)
        }
    }

    async getAllTeachers(req, res, next){
        try {
            const teachers = await teacherService.getAllTeacher()
            return res.json(teachers)
        } catch (error) {
            next(error)
        }
    }

    async delTeacher(req, res, next){
        try {
            const {teacherId} = req.query
            const teacher = await teacherService.delTeacher(teacherId)
            return res.json(teacher)                
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new TeacherController()