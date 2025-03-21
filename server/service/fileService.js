const fs = require("fs")
const { fileModel } = require("../entities/fileModel")
const { createFolder } = require("../utils/createFolder")
const { userModel } = require("../entities/userModel")
const { FileError } = require("../exceptions/fileError")
const { deleteLocalFile, deleteLocalFolder } = require("../utils/deleteContent")
const { createPath } = require("../utils/createPath")
const path = require("path")

class FileService {
    async createDir (user, name, type, parent) {
        const existsFile = await fileModel.exists({ name, parent, type, user: user.id })
        if (!existsFile) {
            const file = await new fileModel({ name, type, parent, user: user.id })
            const parentFile = await fileModel.findOne({ _id: parent })
            if (!parentFile) {
                file.path = name
                await createFolder(file)
            } else {
                file.path = `${parentFile.path}\\${file.name}`
                await createFolder(file)
                parentFile.childs.push(file._id)
                await parentFile.save()
            }
            await file.save()
            return file
        }
        return existsFile
    }
    
    async getFiles (sort, order, user, parent, viewType) {
        const type = viewType || null
        let files
        let sortOrder = order === "inc" ? 1 : -1
        
        const filter = {
            user,
            parent,
            ...(type ? { type } : {}),
        }
        
        switch (sort) {
            case "name":
                files = await fileModel.find(filter).sort({ name: sortOrder })
                break
            case "date":
                files = await fileModel.find(filter).sort({ date: sortOrder })
                break
            case "size":
                files = await fileModel.find(filter).sort({ size: sortOrder })
                break
            default:
                files = await fileModel.find(filter)
        }
        return files
    }
    
    async upload (file, user, parentId, webkitRelativePath = null) {
        const userDB = await userModel.findOne({ _id: user.id })
        
        if (userDB.usedSpace + file.size > user.diskSpace) {
            throw new FileError.InsufficientDiskSpaceError()
        }
        
        // создать вложенные папки если есть webkitRelativePath
        if (webkitRelativePath) {
            const folders = path.dirname(webkitRelativePath).split("/")
            for (const folder of folders) {
                const response = await this.createDir(user, folder, "dir", parentId)
                parentId = response._id
            }
        }
        
        const parent = parentId ? await fileModel.findOne({ user: user.id, _id: parentId }) : null
        
        const filePath = parent ? `${parent.path}\\${file.name}` : file.name
        const fullPath = createPath(user, parent, file)
        
        if (fs.existsSync(fullPath)) {
            throw new FileError.FileAlreadyExistsError()
        }
        
        // если идет аплоуд файла то его обрабатываем
        if (file.mimetype) {
            await file.mv(fullPath)
            userDB.usedSpace += file.size
            
            const type = file.mimetype.split("/")[0]
            const extension = file.name.split(".").pop()
            
            const dbFile = new fileModel({
                name: file.name,
                type,
                extension,
                size: file.size,
                path: filePath,
                parent: parent ? parent._id : null,
                user: user.id,
            })
            
            await dbFile.save()
            await userDB.save()
            
        }
        
        // возвращаем что все гуд
        return true
    }
    
    async downloadFile (userId, fileId) {
        if (!userId || !fileId) {
            throw new FileError.InvalidFileRequest("Отсутствуют id user или file")
        }
        const file = await fileModel.findOne({ user: userId, _id: fileId })
        const path = `${process.env.FILES_DIR_PATH}\\${userId}\\${file.path}`
        if (fs.existsSync(path)) {
            return path
        }
        throw new FileError.FileNotFoundError()
    }
    
    async deleteFiles (userId, fileId) {
        const user = await userModel.findOne({ _id: userId })
        const file = await fileModel.findOne({ user: userId, _id: fileId })
        const filePath = `${process.env.FILES_DIR_PATH}\\${userId}\\${file.path}`
        console.log(filePath)
        if (!file) {
            throw new FileError.FileNotFoundError()
        }
        if (file.type === "dir") {
            const childFiles = await fileModel.find({ parent: file._id })
            for (const childFile of childFiles) {
                await this.deleteFiles(userId, childFile._id)
            }
            // произошла пробежка по всем приколам
            await deleteLocalFolder(filePath)
            
        } else {
            await deleteLocalFile(filePath)
        }
        await fileModel.findByIdAndDelete(file._id)
        user.size = user.size + file.size
        user.save()
        return "lol"
    }
    
    async searchFiles (searchName, userId) {
        let files = await fileModel.find({ user: userId })
        files = files.filter(file => (file.name.toLowerCase()).includes(searchName.toLowerCase()))
        return files
    }
    
    async getFile (fileId, userId, user) {
        if (user.id !== userId) {
            throw new FileError.FilePermissionError()
        }
        const file = await fileModel.findById(fileId)
        if (!file) {
            throw new FileError.FileNotFoundError("Файл или папка не найдены в БД")
        }
        const filePath = `${process.env.FILES_DIR_PATH}\\${user.id}\\${file.path}`
        if (!fs.existsSync(filePath)) {
            throw new FileError.FileNotFoundError("Файл не найден на сервере")
        }
        return filePath
    }
    
    async getFileInfo (file) {
        const paths = file.path.split("\\")
        let fileInfo = [{ name: "Мой диск", id: null }] // Главная папка
        for (const path of paths) {
            try {
                if (fileInfo.length === 1) {
                    let res = await fileModel.findOne({ name: path, parent: null })
                    if (res) {
                        fileInfo.push({ name: res.name, id: res._id })
                    }
                } else {
                    const parentId = fileInfo[fileInfo.length - 1].id
                    let res = await fileModel.findOne({ name: path, parent: parentId })
                    if (res) {
                        fileInfo.push({ name: res.name, id: res._id, type: res.extension })
                    }
                }
            } catch (e) {
                console.log(e)
            }
        }
        return fileInfo
    }
    
}

const fileService = new FileService()
module.exports = {
    fileService,
}