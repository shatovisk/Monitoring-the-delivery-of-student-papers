const {studentGroup} = require('../models/user-model');

class groupController {
    async getById (req, res, next){
        let {studentGroupId} = req.query
        let group = await studentGroup.findOne({where: {id: `${studentGroupId}`}})
        res.json(group)
    }
}

module.exports = new groupController()