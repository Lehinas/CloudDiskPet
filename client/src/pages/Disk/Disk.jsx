import { useSelector } from "react-redux"
import useFetchFiles from "../../hooks/useFetchFiles"
import { useDragAndDrop } from "../../hooks/useDragAndDrop"
import styles from "./Disk.module.css"
import FileControl from "../../components/FileControl/FileControl"
import FileList from "../../components/FileList/FileList"

const Disk = () => {
    const isAuth = useSelector(state => state.user.isAuth)
    
    useFetchFiles()
    const { dragEnter, dragEnterHandler, dragOverHandler, dragLeaveHandler, dropHandler } = useDragAndDrop()
    const currentFolder = useSelector(state => state.files.currentFolder)
    
    return (
        !dragEnter ?
            <div
                className={styles.Disk}
                onDragEnter={dragEnterHandler}
                onDragLeave={dragLeaveHandler}
                onDragOver={dragOverHandler}
            >
                <FileControl />
                <FileList />
            </div>
            :
            <div
                className={styles.Disk_drop_area}
                onDrop={dropHandler}
                onDragEnter={dragEnterHandler}
                onDragLeave={dragLeaveHandler}
                onDragOver={dragOverHandler}
            >
                Перетащите файлы сюда
            </div>
    )
}

export default Disk