class UserDTO{
    id
    email
    username
    isActivated
    diskSpace
    usedSpace
    files
    constructor(model) {
        this.id = model._id
        this.email = model.email
        this.username = model.username
        this.isActivated = model.isActivated
        this.diskSpace = model.diskSpace
        this.usedSpace = model.usedSpace
        this.files = model.files
    }
}

module.exports = {
    UserDTO
}

