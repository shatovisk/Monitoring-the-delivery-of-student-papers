const {studentLesson} = require('../models/user-model'); 

class studentLessonController {
    async getById(req, res){
        let {studentGroupId} = req.query
        const lesson = await studentLesson.findAll({where: {studentGroupId: `${studentGroupId}`}})
        return res.json(lesson)
    }
}

module.exports = new studentLessonController()