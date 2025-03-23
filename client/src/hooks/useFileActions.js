import FileService from "../services/FileService"
import { setFiles } from "../store/fileSlice"
import { useDispatch, useSelector } from "react-redux"

const useFileActions = (file) => {
    const currentDir = useSelector(state => state.files.currentDir)
    const user = useSelector(state => state.user.currentUser)
    
    const dispatch = useDispatch()
    
    const downloadHandler = async (e) => {
        e.stopPropagation()
        try {
            const { data } = await FileService.downloadFile(user.id, file._id, file.type)
            const downloadUrl = window.URL.createObjectURL(data)
            const link = document.createElement("a")
            link.href = downloadUrl
            link.download = file.name
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (e) {
            console.log(e)
        }
    }
    
    const deleteHandler = async (e) => {
        e.stopPropagation()
        if (confirm("Вы уверены?")) {
            try {
                await FileService.deleteFiles(user.id, file._id)
                const res = await FileService.getFiles(currentDir)
                dispatch(setFiles(res.data))
            } catch (e) {
                console.log(e)
            }
        }
    }
    
    const shareHandler = (e) => {
        e.stopPropagation()
        alert("Не реализовано")
    }
    
    const deleteSelectedHandler = async (files) => {
        if (confirm("Вы уверены, что хотите удалить выбранные файлы?")) {
            try {
                for (let fileId of files) {
                    await FileService.deleteFiles(user.id, fileId)
                }
                const res = await FileService.getFiles(currentDir)
                dispatch(setFiles(res.data))
            } catch (e) {
                console.log(e)
            }
        }
    }
    const downloadSelectedHandler = async (selectedFiles) => {
        try {
            const { data } = await FileService.downloadFile(user.id, "", selectedFiles, "multiple")
            const downloadUrl = window.URL.createObjectURL(data)
            const link = document.createElement("a")
            link.href = downloadUrl
            link.download = "files.zip"
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (e) {
            console.log(e)
        }
    }
    return {
        downloadHandler,
        deleteHandler,
        shareHandler,
        deleteSelectedHandler,
        downloadSelectedHandler,
    }
}

export default useFileActions
