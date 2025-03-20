const { userModel } = require("../entities/userModel")
const mailService = require("../service/mailService")
const bcrypt = require("bcryptjs")
const uuid = require("uuid")
const { tokenService } = require("./tokenService")
const { UserDTO } = require("../dto/userDTO")
const { AuthError } = require("../exceptions/authError")
const { fileModel } = require("../entities/fileModel")
const { createFolder } = require("../utils/createFolder")

class UserService {
    async registration (username, email, password) {
        const candidate = await userModel.findOne({ email })
        if (candidate) {
            throw AuthError.BadRequest(`Пользователь с таким ${email} уже существует`)
        }
        const hashPassword = bcrypt.hashSync(password, 7)
        const activationId = uuid.v4()
        const activationLink = `http://localhost:${process.env.SERVER_PORT}/api/auth/activate/${activationId}`
        const user = new userModel({ username, email, password: hashPassword, activationLink: activationId })
        
        await mailService.sendActivationMail(email, activationLink)
        await user.save()
        await createFolder(new fileModel({ user: user._id, name: "" }))
        
        const userDTO = new UserDTO(user)
        const tokens = await tokenService.generateTokens({ ...userDTO })
        await tokenService.saveToken(userDTO.id, tokens.refreshToken, 24 * 30)
        
        return { tokens, user: userDTO }
    }
    
    async login (email, password) {
        const user = await userModel.findOne({ email })
        if (!user) {
            throw AuthError.BadRequest("Пользователь не найден")
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw AuthError.BadRequest("Неверный пароль")
        }
        const userDTO = new UserDTO(user)
        const tokens = await tokenService.generateTokens({ ...userDTO })
        await tokenService.saveToken(userDTO.id, tokens.refreshToken, 30 * 24)
        return { tokens, user: userDTO }
    }
    
    async activate (activationLink) {
        const user = await userModel.findOne({ activationLink })
        if (!user) {
            throw AuthError.BadRequest("Некорректная ссылка активации")
        }
        user.isActivated = true
        await user.save()
    }
    
    async refresh (refreshToken) {
        if (!refreshToken) {
            throw AuthError.BadRequest("Пользователь не авторизован")
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenInDB = await tokenService.findToken(refreshToken)
        
        if (!userData || !tokenInDB) {
            throw AuthError.BadRequest("Пользователь не авторизован / Токен не действителен")
        }
        const user = await userModel.findById(tokenInDB.user)
        const userDTO = new UserDTO(user)
        
        const tokens = await tokenService.generateTokens({ ...userDTO })
        await tokenService.saveToken(userDTO.id, tokens.refreshToken, 24 * 30)
        
        return { tokens, user: userDTO }
    }
    
    async logout (refreshToken) {
        return await tokenService.removeToken(refreshToken)
    }
}

const userService = new UserService()
module.exports = { userService }
