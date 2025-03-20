const jwt = require("jsonwebtoken")
const { tokenModel } = require("../entities/tokenModel")

class TokenService {
    async generateTokens (payload) {
        const accessToken = jwt.sign(payload, process.env.SECRET_KEY_ACCESS, { expiresIn: "15m" })
        const refreshToken = jwt.sign(payload, process.env.SECRET_KEY_REFRESH, { expiresIn: "30d" })
        return { accessToken, refreshToken }
    }
    
    async saveToken (userId, refreshToken, ttlHours) {
        const expiresAt = new Date()
        expiresAt.setHours(expiresAt.getHours() + ttlHours)
        
        const tokenData = await tokenModel.findOne({ user: userId })
        
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            tokenData.expiresAt = expiresAt
            return tokenData.save()
        }
        const token = new tokenModel({
            user: userId,
            refreshToken,
            expiresAt,
        })
        await token.save()
        return token
    }
    
    async removeToken (token) {
        const res = await tokenModel.deleteOne({ refreshToken: token })
        return res
    }
    
    validateRefreshToken (token) {
        try {
            return jwt.verify(token, process.env.SECRET_KEY_REFRESH)
        } catch (e) {
            return null
        }
    }
    
    validateAccessToken (token) {
        try {
            return jwt.verify(token, process.env.SECRET_KEY_ACCESS)
        } catch (e) {
            return null
        }
    }
    
    async findToken (token) {
        const res = await tokenModel.findOne({ refreshToken: token })
        return res
    }
}

const tokenService = new TokenService()

module.exports = { tokenService }
