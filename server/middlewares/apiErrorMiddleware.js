const { ApiError } = require('../exceptions/authError')
const apiErrorMiddleware = (err, req, res, next) => {
    console.log(err.message)
    const {status, message, errors} = err
    if(err instanceof Error){
        return res.status(status).json({message, errors})
    }
    return res.status(500).json({message: "Ошибка сервера"})
}

module.exports = {
    apiErrorMiddleware
}