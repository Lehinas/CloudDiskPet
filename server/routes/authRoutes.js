const Router = require("express")
const {userController} = require("../controller/userController");
const { authMiddleware } = require('../middlewares/authMiddleware')
const router = new Router()


router.post("/registration", userController.registration)
router.post("/login", userController.login)
router.post("/logout", userController.logout)
router.get("/activate/:link", userController.activate)
router.get("/refresh", userController.refresh)
router.get("/users", authMiddleware, userController.users)
module.exports = {
    authRouter: router
}