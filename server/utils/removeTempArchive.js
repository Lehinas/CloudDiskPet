const fs = require("fs")

function removeTempArchive (zipFilePath) {
    return (err) => {
        if (!err) {
            fs.unlink(zipFilePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error("Ошибка при удалении архива:", unlinkErr)
                }
            })
        } else {
            console.error("Ошибка при скачивании архива:", err)
        }
    }
}

module.exports = {
    removeTempArchive,
}
