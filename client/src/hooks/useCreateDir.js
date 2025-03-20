import { useDispatch } from "react-redux"
import FileService from "../services/FileService"
import { addFile } from "../store/fileSlice"

export const useCreateDir = () => {
    const dispatch = useDispatch()
    
    const createFolder = async (dirId, dirName) => {
        try {
            const response = await FileService.createDir(dirId, dirName)
            dispatch(addFile(response.data))
        } catch (e) {
            console.error("Ошибка при созданий папки: ", e)
        }
    }
    
    return { createFolder }
}