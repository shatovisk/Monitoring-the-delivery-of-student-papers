module.exports = class TeacherDto {
    email;
    id;
    isActivated;
    name;
    role;

    constructor(model) {
        this.email = model.email;
        this.id = model.id;
        this.isActivated = model.isActivated;
        this.name = model.name
        this.role = model.role
    }
}