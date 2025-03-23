const fs = require("fs")
const path = require("path")
const archiver = require("archiver")

async function archiveMultiple (foundFiles, zipFilePath, userId) {
    const output = fs.createWriteStream(zipFilePath)
    const archive = archiver("zip", { zlib: { level: 9 }, includeEmptyDirs: true })
    archive.pipe(output)
    
    for (const file of foundFiles) {
        const fullPath = path.join(process.env.FILES_DIR_PATH, userId, file.path)
        if (file.type === "dir") {
            archive.directory(fullPath, file.name)
        } else {
            archive.file(fullPath, { name: file.name })
        }
    }
    
    return new Promise((resolve, reject) => {
        output.on("close", () => resolve(zipFilePath))
        archive.on("error", (err) => reject(err))
        archive.finalize()
    })
}

module.exports = {
    archiveMultiple,
}
