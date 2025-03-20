import React, { useState } from "react"
import styles from "./Search.module.css"
import { useDispatch, useSelector } from "react-redux"
import { pushToFolderStack, setCurrentDir, setCurrentFolder, setFiles, setFolderStack } from "../../store/fileSlice"
import FileService from "../../services/FileService"

import cross from "../../assets/images/cross.svg"
import UiPopup from "../UI/UIpopup/UiPopup"
import usePopupSettings from "../../hooks/usePopupSettings"
import { getLogo } from "../../utils/getLogo"

const Search = () => {
    
    const dispatch = useDispatch()
    const currentDir = useSelector(state => state.files.currentDir)
    const sortName = useSelector(state => state.files.sortName)
    const sortType = useSelector(state => state.files.sortType)
    const user = useSelector(state => state.user.currentUser)
    
    const [foundFiles, setFoundFiles] = useState([])
    const [searchTimeOut, setSearchTimeOut] = useState(false)
    const [searchName, setSearchName] = useState("")
    const { isOpen, togglePopup, popupRef } = usePopupSettings()
    
    const searchHandler = async (e, value) => {
        const { data } = await FileService.searchFiles(value, user.id)
        const filesWithLogo = data.map(item => ({ ...item, logo: getLogo("default", item.type) }))
        setFoundFiles(filesWithLogo)
        togglePopup(e)
    }
    
    const searchNameChangeHandler = async (e) => {
        const search = e.target.value
        setSearchName(search)
        try {
            if (searchTimeOut != false) {
                clearTimeout(searchTimeOut)
            }
            if (search !== "") {
                setSearchTimeOut(setTimeout(async (value) => {
                    await searchHandler(e, value)
                }, 500, search))
            } else {
                const { data } = await FileService.getFiles(currentDir, sortName, sortType)
                dispatch(setFiles(data))
            }
        } catch (e) {
            console.log(e)
        }
    }
    const searchNameClickHandler = async (e) => {
        if(searchName !== ""){
            await searchHandler(e, searchName)
        }
    }
    const clearInput = async () => {
        const { data } = await FileService.getFiles(currentDir, sortName, sortType)
        dispatch(setFiles(data))
        setSearchName("")
    }
    const handleClick = async (e,item) => {
        const { data } = await FileService.getFileInfo(item)
        const arr = data.slice(0, -1)
        const last = arr.pop()
        dispatch(setFolderStack(arr))
        dispatch(setCurrentFolder(last.name))
        dispatch(setCurrentDir(last.id))
        togglePopup(e)
        setSearchName("")
    }
    const layout = (item) => {
        const {path} = item
        const renderPath = `Мой Диск\\${path}\\`
        
        return (
            <div className={styles.layout}>
                {renderPath}
            </div>
        )
    }
    
    return (
        <div className={styles.search}>
            <input
                value={searchName}
                onChange={searchNameChangeHandler}
                onClick={searchNameClickHandler}
                className={styles.search_input}
                placeholder={"Поиск файла"}
            />
            {searchName && <button onClick={clearInput} className={styles.search_btn}><img src={cross} /></button>}
            {isOpen && <UiPopup items={foundFiles} clickHandler={handleClick} ref={popupRef} layout={layout} parentStyles={styles} />}
        </div>
    )
}

export default Search