const fs = require("fs")
const deleteLocalFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Ошибка при удалении файла ${filePath}:`, err)
        } else {
            console.log(`Файл ${filePath} успешно удалён`)
        }
    })
}

const deleteLocalFolder = (folderPath) => {
    fs.rm(folderPath, { recursive: true }, (err) => {
        if (err) {
            console.error(`Ошибка при удалении папки ${folderPath}:`, err)
        } else {
            console.log(`Папка ${folderPath} успешно удалена`)
        }
    })
}

module.exports = {
    deleteLocalFile,
    deleteLocalFolder,
}