const { s3 } = require("../config/aws")
const { archiveDirectory } = require("../utils/archiveDirectory")
const path = require("path")

class AwsService {
    async createFolder (folderPath) {
        if (!folderPath.endsWith("/")) {
            folderPath += "/"
        }
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME, Key: folderPath, Body: "",
        }
        return s3.upload(params).promise()
    }
    
    async uploadFile (fileData, destinationPath) {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME, Key: destinationPath, Body: fileData,
        }
        return s3.upload(params).promise()
    }
    
    async deleteFile (destinationPath) {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME, Key: destinationPath,
        }
        return s3.deleteObject(params).promise()
    }
    
    async deleteFolder (folderPath) {
        if (!folderPath.endsWith("/")) {
            folderPath += "/"
        }
        
        const files = await this.listFiles(folderPath)
        if (!files || files.length === 0) {
            return // Нет объектов для удаления
        }
        
        const deleteParams = {
            Bucket: process.env.AWS_BUCKET_NAME, Delete: { Objects: [] },
        }
        
        files.forEach(({ Key }) => {
            deleteParams.Delete.Objects.push({ Key })
        })
        
        await s3.deleteObjects(deleteParams).promise()
        await this.deleteFolder(folderPath)
    }
    
    async getSignedUrl (destinationPath, expiresIn = 60) {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME, Key: destinationPath, Expires: expiresIn,
        }
        return s3.getSignedUrlPromise("getObject", params)
    }
    
    async listFiles (prefix) {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME, Prefix: prefix,
        }
        
        const data = await s3.listObjectsV2(params).promise()
        return data.Contents || []
    }
    
    async downloadFileStream (s3Key) {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME, Key: s3Key,
        }
        return s3.getObject(params).createReadStream()
    }
    
    async processDirectoryForDownload (userId, folderPath) {
        const s3FolderPrefix = `${folderPath}/`
        const s3Files = await this.listFiles(s3FolderPrefix)
        
        const archiveS3Path = await archiveDirectory(
            userId,
            s3Files,
            s3FolderPrefix,
            path.basename(folderPath),
            this.uploadFile.bind(this),
            this,
        )
        
        const signedUrl = await this.getSignedUrl(archiveS3Path, 60)
        
        setTimeout(() => {
            this.deleteFile(archiveS3Path)
            .catch(err => console.error("Ошибка при удалении архива:", err))
        }, 60000)
        
        return signedUrl
    }
}

const awsService = new AwsService()
module.exports = {
    awsService,
}
