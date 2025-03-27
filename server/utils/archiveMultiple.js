const archiver = require("archiver")
const { awsService } = require("../service/awsService")
const { PassThrough } = require("stream")
const path = require("path")

async function archiveMultiple (userId, foundFiles) {
    const archive = archiver("zip", { zlib: { level: 9 }, includeEmptyDirs: true })
    const archiveStream = new PassThrough()
    
    const archiveName = `multiple_${Date.now()}.zip`
    const archiveS3Path = `${userId}/temp/${archiveName}`
    
    console.log(`Начинаем архивирование в S3: ${archiveS3Path}`)
    
    const uploadPromise = awsService.uploadFile(archiveStream, archiveS3Path)
    
    archive.pipe(archiveStream)
    
    async function addToArchive (file, basePath = "", processedPaths = new Set()) {
        const s3Key = file.type === "dir" ? file.path + "/" : file.path
        
        if (processedPaths.has(s3Key)) {
            console.log(`Пропускаем уже обработанный путь: ${s3Key}`)
            return
        }
        processedPaths.add(s3Key)
        
        const fullPath = path.join(basePath, file.name)
        
        console.log(`Добавляем в архив: ${fullPath} (${s3Key})`)
        
        if (file.type === "dir") {
            const dirContents = await awsService.listFiles(s3Key)
            
            archive.append(null, { name: fullPath + "/" })
            
            for (const item of dirContents) {
                const itemName = path.basename(item.Key)
                
                if (item.Key === s3Key) continue
                
                const itemType = item.Key.endsWith("/") ? "dir" : "file"
                
                await addToArchive({
                    name: itemName,
                    path: item.Key,
                    type: itemType,
                }, fullPath, processedPaths)
            }
        } else {
            const fileStream = await awsService.downloadFileStream(s3Key)
            archive.append(fileStream, { name: fullPath })
        }
    }
    
    const processedPaths = new Set()
    for (const file of foundFiles) {
        await addToArchive(file, "", processedPaths)
    }
    
    archive.on("warning", (err) => {
        if (err.code === "ENOENT") {
            console.warn("Предупреждение архива:", err)
        } else {
            console.error("Ошибка архива:", err)
        }
    })
    
    archive.on("error", (err) => {
        console.error("Ошибка архивации:", err)
    })
    
    await archive.finalize()
    await uploadPromise
    
    console.log(`Архив ${archiveName} загружен в S3`)
    
    return archiveS3Path
}

module.exports = {
    archiveMultiple,
}