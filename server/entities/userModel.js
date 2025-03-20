const {Schema, model, ObjectId} = require("mongoose")

const userSchema = new Schema({
    email: {type: "String", require: true, unique: true},
    username: {type: "String", require: true, unique: true},
    password: {type: "String", require: true},
    diskSpace: {type: "Number", default: 1024**3*10},
    usedSpace: {type: "Number", default: 0},
    avatar: {type: "String"},
    files: {type: ObjectId, ref: "fileModel"},
    activationLink: {type: "String"},
    isActivated: {type: Boolean, default: false}
})

const userModel = model("userModel", userSchema)

module.exports = {
    userModel
}