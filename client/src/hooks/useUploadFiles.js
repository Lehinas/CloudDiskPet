import { useDispatch, useSelector } from "react-redux"
import FileService from "../services/FileService"
import { addUploadFile, showUploader } from "../store/uploadSlice"
import { setFiles } from "../store/fileSlice"

export const useUploadFiles = () => {
    const dispatch = useDispatch()
    const currentDir = useSelector(state => state.files.currentDir)
    const sortName = useSelector(state => state.files.sortName)
    const sortType = useSelector(state => state.files.sortType)
    const viewType = useSelector(state => state.files.viewType)
    const uploadHandler = async (files) => {
        try {
            for (const file of files) {
                const formData = new FormData()
                formData.append("file", file)
                formData.append("webkitRelativePath", file.webkitRelativePath)
                formData.append("parentId", currentDir)
                let uploadFile = {
                    id: Date.now(),
                    name: file.name,
                    progress: 0,
                }
                dispatch(showUploader())
                dispatch(addUploadFile(uploadFile))
                await FileService.uploadFile(formData, uploadFile, dispatch)
            }
            const newFiles = await FileService.getFiles(currentDir, sortName, sortType, viewType)
            dispatch(setFiles(newFiles.data))
        } catch (e) {
            console.log("Ошибка при загрузке файлов: " + e)
        }
    }
    return { uploadHandler }
    
}