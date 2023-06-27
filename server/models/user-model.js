// const {Schema, model} = require('mongoose-sql');

// const UserSchema = new Schema({
//     email: {type: String, unique: true, required: true},
//     studentCardNumber: {type: String, unique: true, required: true},
//     password: {type: String, required: true},
//     isActivated: {type: Boolean, default: false},
//     activationLink: {type: String},
// })

// module.exports = model('User', UserSchema)



const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('student_card', 'postgres', 'rootroot', {
    host: 'localhost',
    dialect: 'postgres'
  })


const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
        },
        studentCardNumber: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isActivated: {
            type: DataTypes.STRING,
            defaultValue: false
        },
        activationLink: {
            type: DataTypes.STRING
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: "USER"
        },
        nameStudent: {
            type: DataTypes.STRING
        },

    },
    {
        tableName: "User",
    }
)


const studentFiles = sequelize.define('studentFiles', {
    id: {
        type: DataTypes.INTEGER, 
        primaryKey: true,
        autoIncrement: true
    },

    nameFile: {
        type: DataTypes.STRING,
        allowNull: false
    },
    },
    {
        // timestamps: false,
    }
)


const teacher = sequelize.define('teacher', {
    id: {
        type: DataTypes.INTEGER, 
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: "TEACHER"
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isActivated: {
        type: DataTypes.STRING,
        defaultValue: false
    },
    activationLink: {
        type: DataTypes.STRING
    },

    },
    {
        timestamps: false,
        tableName: "teacher",
    }
)


const studentGroup = sequelize.define('studentGroup', {
    id: {
        type: DataTypes.INTEGER, 
        primaryKey: true,
        autoIncrement: true
    },
    nameGroup: {
        type: DataTypes.STRING,
        allowNull: false,
    }
    },
    {
        timestamps: false,
        tableName: "studentGroup",
    }
)


const studentLesson = sequelize.define('studentLesson', {
    id: {
        type: DataTypes.INTEGER, 
        primaryKey: true,
        autoIncrement: true
    },
    nameLesson: {
        type: DataTypes.STRING,
        allowNull: false,
    }
    },
    {
        timestamps: false,
        tableName: "studentLesson",
    }
)

const teacher_studentGroup = sequelize.define('teacher_studentGroup', {
    id: {
        type: DataTypes.INTEGER, 
        primaryKey: true,
        autoIncrement: true
    },

    },
    {
        timestamps: false,
        tableName: "teacher_studentGroup",
    }
)



User.hasOne(studentFiles)
studentFiles.belongsTo(User)


studentGroup.hasMany(User)
User.belongsTo(studentGroup)


studentGroup.hasMany(studentLesson)
studentLesson.belongsTo(studentGroup)


studentLesson.hasMany(studentFiles)
studentFiles.belongsTo(studentLesson)


teacher.belongsToMany(studentGroup, {through: teacher_studentGroup})
studentGroup.belongsToMany(teacher, {through: teacher_studentGroup})


teacher.hasMany(studentLesson)
studentLesson.belongsTo(teacher)


module.exports = {
    User,
    studentFiles,
    teacher,
    studentGroup,
    studentLesson,
    teacher_studentGroup,
}