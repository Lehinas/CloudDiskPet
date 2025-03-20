const fs = require("fs")
const { FileError } = require("../exceptions/fileError")

const createFolder = async (file) => {
    const filePath = `${process.env.FILES_DIR_PATH}\\${file.user}\\${file.path}`
    return new Promise((resolve, reject) => {
        try {
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, { recursive: true })
                return resolve({ message: "Файл был создан" })
            } else {
                return reject(FileError.FileAlreadyExistsError())
            }
        } catch (e) {
            return reject(FileError.FileCreationError("Ошибка при создании папки"))
        }
    })
}

module.exports = {
    createFolder,
}
