const path = require('path');
const { studentFiles } = require('../models/user-model');
const ApiError = require('../exceptions/api-error');
const { log } = require('console');
let iconv = require('iconv-lite');


class FileController {
    async create(req, res, next){
        try {
            const {UserId, studentLessonId, nameFile} = req.body
            const {files} = req.files
            const checkDownload = await studentFiles.findOne({where: {UserId: `${UserId}`, studentLessonId: `${studentLessonId}`}})
            if (checkDownload) {
                throw ApiError.BadRequest(`Отчет по данному предмету уже загружен. Удалите отчет или выберите новую дисциплину.`)
            }
            // let fileName = nameFile.name
            files.mv(path.resolve(__dirname, '..', 'files', nameFile))

            const file = await studentFiles.create({nameFile: nameFile, UserId, studentLessonId})

            return res.json(file)
        } catch (error) {
            next(error)
        }
    } 


    async getById(req, res, next){
        try {
            let {UserId, limit, page} = req.query
            let files;
            let metaFiles;
            let studentLessonId = [];
            page = page || 1
            limit = limit || 9
            let offset = page * limit - limit
            files = await studentFiles.findAndCountAll({where: {UserId}, limit, offset})
            // metaFiles = await studentFiles.findAll({where: {UserId}})
            // console.log("FILES", files);
            return res.json(files)
        } catch (error) {
            next(error)
        }
    }

    async deleteById(req, res, next) {
        try {
            let {UserId, studentLessonId} = req.query
            const checkDownload = await studentFiles.findOne({where: {UserId: `${UserId}`, studentLessonId: `${studentLessonId}`}})
            if (!checkDownload) {
                throw ApiError.BadRequest(`Отчет по данной дисциплине не загружен`)
            }
            const files = await studentFiles.destroy({where: {UserId: `${UserId}`, studentLessonId: `${studentLessonId}`}})
            return res.json(files)
        } catch (error) {
            next(error)
        }
    }
}


module.exports = new FileController()