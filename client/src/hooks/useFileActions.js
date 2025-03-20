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
            const { data } = await FileService.downloadFile(user.id, file._id)
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
                const { data } = await FileService.deleteFiles(user.id, file._id)
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
    
    return {
        downloadHandler,
        deleteHandler,
        shareHandler,
    }
    
}

export default useFileActions