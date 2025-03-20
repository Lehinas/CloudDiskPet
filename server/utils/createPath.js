
const FILES_DIR_PATH = process.env.FILES_DIR_PATH

const createPath = (user, parent, file, relativePath) => {
    let path
    if (relativePath) {
        if (parent) {
            path = `${FILES_DIR_PATH}\\${user.id}\\${parent.path}\\${relativePath}\\${file.name}`
        } else {
            path = `${FILES_DIR_PATH}\\${user.id}\\${relativePath}\\${file.name}`
        }
    } else {
        if (parent) {
            path = `${FILES_DIR_PATH}\\${user.id}\\${parent.path}\\${file.name}`
        } else {
            path = `${FILES_DIR_PATH}\\${user.id}\\${file.name}`
        }
    }
    return path
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}

module.exports = {
    createPath,
}