// const {Schema, model} = require('mongoose-sql');

// const TokenSchema = new Schema({
//     user: {type: Schema.ObjectId, ref: 'User'},
//     refreshTokenk: {type: String, required: true},
// })

// module.exports = model('Token', TokenSchema)



const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('student_card', 'postgres', 'rootroot', {
    host: 'localhost',
    dialect: 'postgres'
  })


module.exports = sequelize.define(
    'Token',
    {
        user: {
            type: DataTypes.STRING,
            references: 'User'
        },
        refreshToken: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: "Token",
        timestamps: false,
    }
)