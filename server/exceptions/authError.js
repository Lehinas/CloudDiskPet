class AuthError extends Error {
    status
    errors
    
    constructor (status, message, errors = []) {
        super(message)
        this.status = status
        this.errors = errors
    }
    
    static UnauthorizedError (message = "Пользователь не авторизован") {
        return new AuthError(401, message)
    }
    
    static BadRequest (message, errors = []) {
        return new AuthError(400, message, errors)
    }
}

module.exports = {
    AuthError: AuthError,
}