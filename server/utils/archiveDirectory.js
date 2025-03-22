const fs = require("fs")
const archiver = require("archiver")

function archiveDirectory (sourceDir, zipFilePath) {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(zipFilePath)
        const archive = archiver("zip", { zlib: { level: 9 } })
        
        output.on("close", () => resolve())
        archive.on("error", (err) => reject(err))
        
        archive.pipe(output)
        archive.directory(sourceDir, false)
        archive.finalize()
    })
}

module.exports = {
    archiveDirectory
}
