const Router = require('express').Router;
const router = new Router();
const {body} = require('express-validator');
const authMiddleware = require('../middleware/auth-middleware');
const teacherController = require('../controllers/teacher-controller');


router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 20}),
    teacherController.registration)
router.post('/login', teacherController.login);
router.post('/logout', teacherController.logout);
router.post('/lesson', teacherController.addLesson)
router.get('/activate/:link', teacherController.activate);
router.get('/refresh', teacherController.refresh);
router.get('/groupId', teacherController.getGroupId)
router.get('/students', teacherController.getStudentsByGroup)
router.get('/group', teacherController.getGroup)
router.delete('/lesson', teacherController.delLesson)

router.post('/group', teacherController.addGroup)
router.delete('/group', teacherController.delGroup)
router.get('/groups', teacherController.getAllGroups)
router.get('/teachers', teacherController.getAllTeachers)
router.put('/lesson', teacherController.updateLesson)
router.get('/lesson', teacherController.getLesson)
router.delete('/teachers', teacherController.delTeacher)

module.exports = router