import React, { useEffect, useRef, useState } from "react"
import styles from "./FileList.module.css"
import { useDispatch, useSelector } from "react-redux"
import File from "../File/File"
import { changeSortName } from "../../store/fileSlice"
import { ReactComponent as CrossLogo } from "../../assets/images/cross.svg"
import { ReactComponent as ShareLogo } from "../../assets/images/share.svg"
import { ReactComponent as DownloadLogo } from "../../assets/images/download.svg"
import { ReactComponent as DeleteLogo } from "../../assets/images/delete.svg"
import useFileActions from "../../hooks/useFileActions"

const FileList = () => {
    const dispatch = useDispatch()
    const containerRef = useRef(null)
    const files = useSelector(state => state.files.files)
    const fileView = useSelector(state => state.files.fileView)
    const [selectionBox, setSelectionBox] = useState(null)
    const [selectedFiles, setSelectedFiles] = useState([])
    
    const { deleteSelectedHandler, downloadSelectedHandler } = useFileActions()
    
    useEffect(() => {}, [fileView])
    
    const changeSort = (value) => {
        dispatch(changeSortName(value))
    }
    
    const handleMouseDown = (e) => {
        const fileElement = e.target.closest("[data-file-id]")
        if (fileElement) {
            const id = fileElement.getAttribute("data-file-id")
            if (selectedFiles.includes(id)) {
                return
            }
        }
        if (!e.ctrlKey) {
            setSelectedFiles([])
        }
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
        
        const rect = containerRef.current.getBoundingClientRect()
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
    const handleSelection = (id, add) => {
        if (add) {
            setSelectedFiles(prev =>
                prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
            )
        } else {
            setSelectedFiles([id])
        }
    }
    
    return (
        <>
            {fileView === "list" ? (
                <div
                    className={styles.FileList}
                    ref={containerRef}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                >
                    {selectedFiles.length > 0 && (
                        <div
                            className={styles.selectionBar}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button onClick={() => setSelectedFiles([])}>
                                <CrossLogo className={styles.selectionBar_cross} /></button>
                            <span>Выбрано: {selectedFiles.length}</span>
                            <button onClick={() => downloadSelectedHandler(selectedFiles)}><DownloadLogo /></button>
                            <button onClick={() => shareHandler(selectedFiles)}><ShareLogo /></button>
                            <button onClick={() => deleteSelectedHandler(selectedFiles)}><DeleteLogo /></button>
                        </div>
                    )}
                    
                    <div className={styles.FileList_header} onMouseDown={e => e.stopPropagation()}>
                        <div className={styles.FileList_name} onClick={() => changeSort("name")}>Название</div>
                        <div className={styles.FileList_date} onClick={() => changeSort("date")}>Дата</div>
                        <div className={styles.FileList_size} onClick={() => changeSort("size")}>Размер</div>
                    </div>
                    {files.length ? (
                        files.map(file => (
                            <File
                                key={file._id}
                                file={file}
                                isSelected={selectedFiles.includes(file._id)}
                                handleSelection={handleSelection}
                            />
                        ))
                    ) : (
                        <div className={styles.noFilesText}>Добавьте сюда файлы</div>
                    )}
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
            ) : (
                <div className={`${styles.FilePlate} ${files.length === 0 ? styles.noFilesPlate : ""}`}>
                    {files.length >= 1 ? (
                        files.map(file => <File key={file._id} file={file} />)
                    ) : (
                        <div className={styles.noFilesText}>Добавьте сюда файлы</div>
                    )}
                </div>
            )}
        </>
    )
}

export default FileList
