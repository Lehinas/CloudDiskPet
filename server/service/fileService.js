const fs = require("fs")
const { fileModel } = require("../entities/fileModel")
const { userModel } = require("../entities/userModel")
const path = require("path")
const { FileError } = require("../exceptions/fileError")
const { archiveMultiple } = require("../utils/archiveMultiple")
const { awsService } = require("./awsService")

class FileService {
    async createDir (user, name, type, parent) {
        const existsFile = await fileModel.exists({ name, parent, type, user: user.id })
        if (!existsFile) {
            const file = new fileModel({ name, type, parent, user: user.id })
            const parentFile = parent ? await fileModel.findOne({ _id: parent }) : null
            
            if (!parentFile) {
                file.path = `${user.id}/${name}`
            } else {
                file.path = `${parentFile.path}/${name}`
                parentFile.childs.push(file._id)
                await parentFile.save()
            }
            
            await awsService.createFolder(file.path)
            await file.save()
            
            return file
        }
        throw FileError.FileAlreadyExistsError()
    }
    
    async getFiles (sort, order, user, parent, viewType) {
        const type = viewType || null
        let files
        let sortOrder = order === "inc" ? 1 : -1
        
        const filter = {
            user, parent, ...(type ? { type } : {}),
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
            throw FileError.InsufficientDiskSpaceError()
        }
        
        // Создать вложенные папки, если есть webkitRelativePath
        if (webkitRelativePath) {
            const folders = path.dirname(webkitRelativePath).split("/")
            for (const folder of folders) {
                const file = await this.createDir(user, folder, "dir", parentId)
                parentId = file._id
            }
        }
        
        const parent = parentId ? await fileModel.findOne({ user: user.id, _id: parentId }) : null
        const filePath = parent ? `${parent.path}/${file.name}` : `${user.id}/${file.name}`
        
        await awsService.uploadFile(file.data, filePath)
        
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
        userDB.usedSpace += file.size
        await userDB.save()
        
        return dbFile
    }
    
    async downloadFile (userId, fileId) {
        if (!userId || !fileId) {
            throw FileError.InvalidFileRequest("Отсутствуют id user или file")
        }
        
        const file = await fileModel.findOne({ user: userId, _id: fileId })
        if (!file) {
            throw FileError.FileNotFoundError()
        }
        return awsService.getSignedUrl(file.path, 60)
    }
    
    async downloadDirectory (userId, fileId) {
        if (!userId || !fileId) {
            throw FileError.InvalidFileRequest("Отсутствуют id user или file")
        }
        
        const folder = await fileModel.findOne({ user: userId, _id: fileId })
        if (!folder) {
            throw FileError.FileNotFoundError()
        }
        if (folder.type !== "dir") {
            throw FileError.InvalidFileTypeError("Указанный файл не является директорией")
        }
        
        return await awsService.processDirectoryForDownload(userId, folder.path)
    }
    
    async deleteFiles (userId, fileId) {
        const user = await userModel.findOne({ _id: userId })
        const file = await fileModel.findOne({ user: userId, _id: fileId })
        if (!file) {
            throw FileError.FileNotFoundError()
        }
        
        if (file.type === "dir") {
            const childFiles = await fileModel.find({ parent: file._id })
            for (const childFile of childFiles) {
                await this.deleteFiles(userId, childFile._id)
            }
            // Удаляем "папку" на aws s3
            await awsService.deleteFolder(file.path)
        } else {
            // Удаляем файл на awss3
            await awsService.deleteFile(file.path)
        }
        
        if (file.parent) {
            const parentFile = await fileModel.findOne({ _id: file.parent })
            if (parentFile) {
                parentFile.childs = parentFile.childs.filter(childId => childId.toString() !== file._id.toString())
                await parentFile.save()
            }
        }
        
        await fileModel.findByIdAndDelete(file._id)
        
        user.size = user.size + file.size
        await user.save()
        
        return true
    }
    
    async downloadMultiple (userId, files) {
        if (!Array.isArray(files)) {
            throw FileError.InvalidFileRequest("Неверный формат параметра files, должен быть массивом")
        }
        
        const foundFiles = await fileModel.find({ user: userId, _id: { $in: files } })
        if (!foundFiles.length) {
            throw FileError.FileNotFoundError("Файлы не найдены")
        }
        
        const archiveS3Path = await archiveMultiple(userId, foundFiles)
        
        const signedUrl = await awsService.getSignedUrl(archiveS3Path, 60)
        
        setTimeout(() => {
            awsService.deleteFile(archiveS3Path)
            .catch(err => console.error("Ошибка при удалении архива:", err))
        }, 60000)
        
        return signedUrl
    }
    
    async searchFiles (searchName, userId) {
        let files = await fileModel.find({ user: userId })
        files = files.filter(file => (file.name.toLowerCase()).includes(searchName.toLowerCase()))
        return files
    }
    
    async getFile (fileId, userId, user) {
        if (user.id !== userId) {
            throw FileError.FilePermissionError()
        }
        const file = await fileModel.findById(fileId)
        if (!file) {
            throw FileError.FileNotFoundError("Файл или папка не найдены в БД")
        }
        const filePath = `${process.env.FILES_DIR_PATH}\\${user.id}\\${file.path}`
        if (!fs.existsSync(filePath)) {
            throw FileError.FileNotFoundError("Файл не найден на сервере")
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