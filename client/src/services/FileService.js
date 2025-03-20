import { api } from "../http"
import { changeProgress } from "../store/uploadSlice"

export default class FileService {
    static async getFiles (dirId, sortName, sortType, viewType) {
        return api.get("api/files", {
            params: {
                parent: dirId,
                sortName,
                sortType,
                viewType,
            },
        })
    }
    
    static async createDir (dirId, name) {
        console.log(typeof dirId)
        return api.post("api/files/", { name, type: "dir", parent: dirId })
    }
    
    static async uploadFile (formData, uploadFile, dispatch) {
        return api.post("api/files/upload", formData, {
            onUploadProgress: progressEvent => {
                const totalLength = progressEvent.lengthComputable
                    ? progressEvent.total
                    : progressEvent.target.getResponseHeader("content-length") || progressEvent.target.getResponseHeader("x-decompressed-content-length")
                if (totalLength) {
                    const progress = Math.round((progressEvent.loaded * 100) / totalLength)
                    const updatedFile = {
                        ...uploadFile,
                        progress: progress,
                    }
                    dispatch(changeProgress(updatedFile))
                }
            },
        })
    }
    
    static async downloadFile (userId, fileId) {
        return api.get("api/files/download", {
            params: {
                userId: userId,
                fileId: fileId,
            },
            responseType: "blob",
        })
    }
    
    static async deleteFiles (userId, fileId) {
        return api.delete("api/files/", {
            params: {
                userId: userId,
                fileId: fileId,
            },
        })
    }
    
    static async searchFiles (searchName, userId) {
        return api.get("api/files/search", {
            params: {
                searchName,
                userId,
            },
        })
    }
    
    static async getFile (fileId, userId) {
        return api.get("api/files/file", {
            params: {
                fileId,
                userId,
            },
            responseType: "blob",
        })
    }
    
    static async getFileInfo (file) {
        return api.get("api/files/fileInfo", {
            params: {
                file,
            },
        })
    }
}