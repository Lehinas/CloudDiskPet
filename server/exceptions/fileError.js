class FileError extends Error {
    status
    errors
    
    constructor (status, message, errors = []) {
        super(message)
        this.status = status
        this.errors = errors
    }
    
    static InvalidFileNameError (message = "Недопустимое имя файла или папки", errors = []) {
        return new FileError(400, message, errors)
    }
    
    static InvalidFileTypeError (message = "Неверный формат или тип файла", errors = []) {
        return new FileError(400, message, errors)
    }
    
    static InvalidFileRequest (message = "Неверные данные", errors = []) {
        return new FileError(400, message, errors)
    }
    
    static FilePermissionError (message = "Недостаточно прав для доступа к файлу или папке", errors = []) {
        return new FileError(403, message, errors)
    }
    
    static FileNotFoundError (message = "Файл или папка не найдены") {
        return new FileError(404, message)
    }
    
    static FileAlreadyExistsError (message = "Файл или папка уже существуют", errors = []) {
        return new FileError(409, message, errors)
    }
    
    static FileCreationError (message, errors = []) {
        return new FileError(500, message, errors)
    }
    
    static InsufficientDiskSpaceError (message = "Недостаточно места на диске для загрузки файла", errors = []) {
        return new FileError(507, message, errors)
    }
}

module.exports = {
    FileError,
}
