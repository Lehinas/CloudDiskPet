const archiver = require("archiver")
const { PassThrough } = require("stream")

async function archiveDirectory (userId, s3Files, s3FolderPrefix, folderName, uploadFileToS3, awsService) {
    const archive = archiver("zip", { zlib: { level: 9 } })
    const archiveStream = new PassThrough()
    
    const archiveName = `tmp_${folderName}_${Date.now()}.zip`
    const archiveS3Path = `${userId}/temp/${archiveName}`
    
    const uploadPromise = uploadFileToS3(archiveStream, archiveS3Path)
    
    archive.pipe(archiveStream)
    
    await Promise.all(s3Files.map(async (fileObj) => {
        const s3Key = fileObj.Key
        
        if (s3Key === s3FolderPrefix || !s3Key.startsWith(s3FolderPrefix)) {
            return
        }
        
        const relativePath = `${folderName}/${s3Key.substring(s3FolderPrefix.length)}`
        
        const fileStream = await awsService.downloadFileStream(s3Key)
        
        archive.append(fileStream, { name: relativePath })
    }))
    
    await archive.finalize()
    
    await uploadPromise
    
    return archiveS3Path
}

module.exports = { archiveDirectory }