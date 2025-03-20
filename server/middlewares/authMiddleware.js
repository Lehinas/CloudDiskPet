const { AuthError } = require("../exceptions/authError")
const { tokenService } = require("../service/tokenService")
const authMiddleware = (req, res, next) => {
    
    if (req.method === "OPTIONS") {
        return next()
    }
    
    try {
        const accessToken = req.headers.authorization
        if (!accessToken) {
            return next(AuthError.UnauthorizedError("Нету акцесс токена"))
        }
        const userData = tokenService.validateAccessToken(accessToken)
        if (!userData) {
            return next(AuthError.UnauthorizedError("Акцесс токен не действителен"))
        }
        req.user = userData
        next()
    } catch (e) {
        next(AuthError.UnauthorizedError())
    }
}

module.exports = {
    authMiddleware,
}