const fs = require("fs")
const path = require("path")
const archiver = require("archiver")

async function archiveMultiple(foundFiles, zipFilePath, userId) {
    console.log("Начало архивирования. Путь архива:", zipFilePath)
    const output = fs.createWriteStream(zipFilePath)
    
    output.on("open", () => {
        console.log("Поток записи открыт для файла:", zipFilePath)
    })
    
    const archive = archiver("zip", { zlib: { level: 9 }, includeEmptyDirs: true })
    archive.pipe(output)
    
    for (const file of foundFiles) {
        const fullPath = path.join(process.env.FILES_DIR_PATH, userId, file.path)
        console.log(`Попытка добавить ${file.name} по пути ${fullPath}`)
        if (file.type === "dir") {
            archive.directory(fullPath, file.name)
            console.log(`Добавлена директория: ${file.name}`)
        } else {
            archive.file(fullPath, { name: file.name })
            console.log(`Добавлен файл: ${file.name}`)
        }
    }
    
    archive.on("warning", (err) => {
        if (err.code === 'ENOENT') {
            console.warn("Предупреждение архива:", err)
        } else {
            console.error("Ошибка архива:", err)
        }
    })
    
    archive.on("error", (err) => {
        console.error("Ошибка архивации:", err)
    })
    
    return new Promise((resolve, reject) => {
        output.on("close", () => {
            console.log("Архивирование завершено. Размер архива:", archive.pointer(), "байт")
            resolve(zipFilePath)
        })
        archive.on("error", (err) => reject(err))
        console.log("Вызов archive.finalize()")
        archive.finalize()
    })
}

module.exports = {
    archiveMultiple,
}
