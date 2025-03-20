const { Schema, model, ObjectId } = require('mongoose')

const tokenSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'userModel',
  },
  refreshToken: {
    type: 'String',
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
})
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const tokenModel = model('tokenModel', tokenSchema)
module.exports = {
  tokenModel,
}