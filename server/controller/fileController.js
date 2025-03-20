const { fileModel } = require("../entities/fileModel")
const { fileService } = require("../service/fileService")

class FileController {
    async createDir (req, res, next) {
        try {
            const { name, type, parent } = req.body
            const user = req.user
            const file = await fileService.createDir(user, name, type, parent)
            res.json(file)
        } catch (e) {
            next(e)
        }
    }
    
    async getFiles (req, res, next) {
        try {
            const { sortName, sortType, parent, viewType } = req.query
            const user = req.user.id
            const files = await fileService.getFiles(sortName, sortType, user, parent, viewType)
            return res.json(files)
        } catch (e) {
            next(e)
        }
    }
    
    async upload (req, res, next) {
        try {
            const { files, user, body } = req
            if (body.parentId === "null") {
                body.parentId = null
            }
            const status = await fileService.upload(files.file, user, body.parentId, body.webkitRelativePath)
            res.json(status)
        } catch (e) {
            next(e)
        }
    }
    
    async downloadFile (req, res, next) {
        try {
            const { userId, fileId } = req.query
            const path = await fileService.downloadFile(userId, fileId)
            res.download(path)
        } catch (e) {
            next(e)
        }
    }
    
    async deleteFiles (req, res, next) {
        try {
            const { fileId, userId } = req.query
            const response = await fileService.deleteFiles(userId, fileId)
            res.json(response)
        } catch (e) {
            next(e)
        }
    }
    
    async searchFiles (req, res, next) {
        try {
            const { searchName, userId } = req.query
            const files = await fileService.searchFiles(searchName, userId)
            res.json(files)
        } catch (e) {
            next(e)
        }
    }
    
    async getFile (req, res, next) {
        try {
            const { fileId, userId } = req.query
            const user = req.user
            const filePath = await fileService.getFile(fileId, userId, user)
            res.sendFile(filePath)
        } catch (e) {
            next(e)
        }
    }
    
    async getFileInfo (req, res, next) {
        try {
            const {file} = req.query
            const fileInfo = await fileService.getFileInfo(file)
            res.json(fileInfo)
        } catch (e){
            next(e)
        }
    }
}

const fileController = new FileController()
module.exports = {
    fileController,
}