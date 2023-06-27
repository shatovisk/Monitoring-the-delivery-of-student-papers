const Router = require('express').Router;
const userControler = require('../controllers/user-controller');
const router = new Router();
const {body} = require('express-validator');
const authMiddleware = require('../middleware/auth-middleware');
const multer = require('multer');
const fileController = require('../controllers/file-controller');
const groupController = require('../controllers/group-controller');
const lessonController = require('../controllers/studentLesson-controller');



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './app/uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
})




router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 20}),
    userControler.registrtion)
router.post('/login', userControler.login);
router.post('/logout', userControler.logout);
router.get('/activate/:link', userControler.activate);
router.get('/refresh', userControler.refresh);
router.get('/users', authMiddleware, userControler.getUsers);
router.get('/group', groupController.getById)
router.get('/lesson', lessonController.getById)

router.post('/page/upload', fileController.create)
router.get('/page/upload', fileController.getById)
router.delete('/page/upload', fileController.deleteById)

module.exports = router 