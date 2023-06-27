require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const { Sequelize } = require('sequelize');
const router = require('./router/index');
const errorMiddleware = require('./middleware/error-middleware');
const models = require('./models/user-model')
const fileUpload = require('express-fileupload')
const path = require('path');

const PORT = process.env.PORT || 5800;
const app = express()
const sequelize = new Sequelize(process.env.DB_URL)

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));
app.use(express.static(path.resolve(__dirname, 'files')))
app.use(fileUpload({}))
app.use('/api', router);
app.use(errorMiddleware);


const start = async () => {
    try {
        try {
            await sequelize.authenticate()
            await sequelize.sync()
            console.log('Соединение с БД было успешно установлено')
          } catch (e) {
            console.log('Невозможно выполнить подключение к БД: ', e)
          }
        app.listen(PORT, console.log(`Server started on PORT = ${PORT}`))
    } catch (error) {
        console.log(error)
    }
}   



start()