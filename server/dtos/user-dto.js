module.exports = class UserDto {
    email;
    id;
    isActivated;
    studentCardNumber;
    studentGroupId;
    nameStudent;
    
    constructor(model){
        this.email = model.email;
        this.id = model.id;
        this.isActivated = model.isActivated;
        this.studentCardNumber = model.studentCardNumber;
        this.studentGroupId = model.studentGroupId;
        this.nameStudent = model.nameStudent;
    }
    
}