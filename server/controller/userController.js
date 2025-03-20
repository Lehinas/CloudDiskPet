const {userService} = require("../service/userService");

class UserController {
    async registration(req, res, next){
        try {
            const {email, username, password} = req.body
            const userData = await userService.registration(username, email, password)
            res.cookie("refreshToken", userData.tokens.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next){
        try {
            const {email, password} = req.body
            const userData = await userService.login(email, password)
            res.cookie("refreshToken", userData.tokens.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
            return res.json(userData)
        } catch (e){
            next(e)
        }
    }
    async logout(req, res, next){
        try {
            const {refreshToken} = req.cookies
            const token = await userService.logout(refreshToken)
            res.clearCookie("refreshToken")
            return res.json(token)
        } catch (e) {
            next(e)
        }
    }
    async refresh(req, res, next){
        try {
            const {refreshToken} = req.cookies
            const userData = await userService.refresh(refreshToken)
            res.cookie("refreshToken", userData.tokens.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }
    async activate(req, res, next){
        try {
            const activationLink = req.params.link
            await userService.activate(activationLink)
            return res.redirect("http://localhost:3000/")
        } catch (e) {
            next(e)
        }

    }
    async users(req, res, next){
        try {
            return res.json("123")
        } catch (e) {
            next(e)
        }
    }
}

const userController = new UserController()

module.exports = {
    userController
}