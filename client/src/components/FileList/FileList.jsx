import React, { useEffect, useRef, useState } from "react"
import styles from "./FileList.module.css"
import { useDispatch, useSelector } from "react-redux"
import File from "../File/File"
import { changeSortName } from "../../store/fileSlice"

const FileList = () => {
    
    const dispatch = useDispatch()
    const containerRef = useRef(null)
    
    const files = useSelector(state => state.files.files)
    const fileView = useSelector(state => state.files.fileView)
    const [selectionBox, setSelectionBox] = useState(null)
    const [selectedFiles, setSelectedFiles] = useState([])
    useEffect(() => {
    
    }, [fileView])
    
    const changeSort = (value) => {
        dispatch(changeSortName(value))
    }
    
    const handleMouseDown = (e) => {
        setSelectedFiles([])
        const rect = containerRef.current.getBoundingClientRect()
        const scrollLeft = containerRef.current.scrollLeft
        const scrollTop = containerRef.current.scrollTop
        
        setSelectionBox({
            startX: e.clientX - rect.left + scrollLeft,
            startY: e.clientY - rect.top + scrollTop,
            endX: e.clientX - rect.left + scrollLeft,
            endY: e.clientY - rect.top + scrollTop,
        })
        
    }
    
    const handleMouseMove = (e) => {
        if (!selectionBox) return
        
        const rect = containerRef.current.getBoundingClientRect() // Контейнер
        const scrollLeft = containerRef.current.scrollLeft
        const scrollTop = containerRef.current.scrollTop
        
        const newSelectionBox = {
            startX: selectionBox.startX,
            startY: selectionBox.startY,
            endX: e.clientX - rect.left + scrollLeft,
            endY: e.clientY - rect.top + scrollTop,
        }
        
        setSelectionBox(newSelectionBox)
        
        const selected = files.filter((file) => {
            const fileElement = document.querySelector(`[data-file-id="${file._id}"]`)
            if (!fileElement) return false
            
            const fileLeft = fileElement.offsetLeft
            const fileTop = fileElement.offsetTop
            const fileWidth = fileElement.offsetWidth
            const fileHeight = fileElement.offsetHeight
            
            const fileRect = {
                left: fileLeft,
                top: fileTop,
                right: fileLeft + fileWidth,
                bottom: fileTop + fileHeight,
            }
            
            const selectionRect = {
                left: Math.min(newSelectionBox.startX, newSelectionBox.endX),
                top: Math.min(newSelectionBox.startY, newSelectionBox.endY),
                right: Math.max(newSelectionBox.startX, newSelectionBox.endX),
                bottom: Math.max(newSelectionBox.startY, newSelectionBox.endY),
            }
            
            return (
                fileRect.left < selectionRect.right &&
                fileRect.right > selectionRect.left &&
                fileRect.top < selectionRect.bottom &&
                fileRect.bottom > selectionRect.top
            )
        })
        
        setSelectedFiles(selected.map((file) => file._id))
    }
    
    const handleMouseUp = (e) => {
        setSelectionBox(null)
    }
    return (
        <>
            {
                fileView === "list" ?
                    <div
                        className={styles.FileList}
                        ref={containerRef}
                        // onMouseDown={handleMouseDown}
                        // onMouseUp={handleMouseUp}
                        // onMouseMove={handleMouseMove}
                    >
                        <div className={styles.FileList_header} onMouseDown={e => e.stopPropagation()}>
                            <div className={styles.FileList_name} onClick={() => changeSort("name")}>Название</div>
                            <div className={styles.FileList_date} onClick={() => changeSort("date")}>Дата</div>
                            <div className={styles.FileList_size} onClick={() => changeSort("size")}>Размер</div>
                        </div>
                        {files.length >= 1 && files.map(file => <File
                            key={file._id}
                            file={file}
                            isSelected={selectedFiles.includes(file._id)}
                        />)}
                        {selectionBox && (
                            <div
                                className={styles.SelectionBox}
                                style={{
                                    left: Math.min(selectionBox.startX, selectionBox.endX),
                                    top: Math.min(selectionBox.startY, selectionBox.endY),
                                    width: Math.abs(selectionBox.endX - selectionBox.startX),
                                    height: Math.abs(selectionBox.endY - selectionBox.startY),
                                }}
                            />
                        )}
                    </div>
                    :
                    <div className={styles.FilePlate}>
                        {files.length >= 1 && files.map(file => <File key={file._id} file={file} />)}
                    </div>
            }
        
        </>
    )
}

export default FileList