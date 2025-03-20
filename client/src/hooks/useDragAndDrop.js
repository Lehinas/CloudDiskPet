import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
import { useUploadFiles } from "./useUploadFiles"

export const useDragAndDrop = () => {
    const dispatch = useDispatch()
    const currentDir = useSelector(state => state.files.currentDir)
    
    const { uploadHandler } = useUploadFiles()
    const [dragEnter, setDragEnter] = useState(false)
    
    const dragEnterHandler = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragEnter(true)
    }
    const dragOverHandler = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragEnter(true)
    }
    const dragLeaveHandler = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragEnter(false)
    }
    const dropHandler = (e) => {
        e.preventDefault()
        e.stopPropagation()
        const files = [...e.dataTransfer.files]
        uploadHandler(files)
        setDragEnter(false)
    }
    
    return {
        dragEnter, dragEnterHandler, dragOverHandler, dragLeaveHandler, dropHandler,
    }
}