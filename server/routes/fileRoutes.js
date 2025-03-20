const Router = require("express")
const { authMiddleware } = require("../middlewares/authMiddleware")
const { fileController } = require("../controller/fileController")
const router = new Router()

router.post("/", authMiddleware, fileController.createDir)
router.get("/", authMiddleware, fileController.getFiles)
router.post("/upload", authMiddleware,  fileController.upload)
router.get("/download", authMiddleware,  fileController.downloadFile)
router.delete("/", authMiddleware, fileController.deleteFiles)
router.get("/search", authMiddleware, fileController.searchFiles)
router.get("/fileInfo", authMiddleware, fileController.getFileInfo)
router.get("/file", authMiddleware, fileController.getFile)

module.exports = {
    fileRouter: router,
}