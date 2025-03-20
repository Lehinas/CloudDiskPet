const { Schema, ObjectId, model } = require("mongoose")

const fileSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    extension: { type: String},
    accessLink: { type: String },
    size: { type: Number, default: 0 },
    path: { type: String, default: "" },
    date: { type: Date, default: Date.now() },
    user: { type: ObjectId, ref: "userModel" },
    parent: { type: ObjectId, ref: "fileModel" },
    childs: [{ type: ObjectId, ref: "fileModel" }],
})

const fileModel = model("fileModel", fileSchema)
module.exports = {
    fileModel,
}