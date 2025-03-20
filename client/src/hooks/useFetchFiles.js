import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setCurrentDir, setFiles } from "../store/fileSlice"
import FileService from "../services/FileService"

const useFetchFiles = () => {
    const sortName = useSelector(state => state.files.sortName)
    const sortType = useSelector(state => state.files.sortType)
    const currentDir = useSelector(state => state.files.currentDir)
    const viewType = useSelector(state => state.files.viewType)
    const isAuth = useSelector(state => state.user.isAuth)
    const dispatch = useDispatch()
    
    const fetchFiles = async () => {
        try {
            const response = await FileService.getFiles(currentDir, sortName, sortType, viewType)
            dispatch(setFiles(response.data))
        } catch (e) {
            console.error("Ошибка при запросе файлов: ", e)
        }
    }
    useEffect(() => {
        if (isAuth) {
            fetchFiles()
        }
    }, [dispatch, isAuth, currentDir, sortName, sortType, viewType])
}

export default useFetchFiles