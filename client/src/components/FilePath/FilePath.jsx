import React, { useState } from "react"
import styles from "./FilePath.module.css"
import arrow_drop_down from "../../assets/images/arrow_drop_down.svg"
import { useDispatch, useSelector } from "react-redux"
import create_new from "../../assets/images/create_new.svg"
import upload_file from "../../assets/images/upload_file.svg"
import upload_folder from "../../assets/images/folder_upload.svg"
import chevron_right from "../../assets/images/chevron_right.svg"
import usePopupSettings from "../../hooks/usePopupSettings"
import UploadPopupItem from "../UploadPopupItem/UploadPopupItem"
import Popup from "../Popup/Popup"

const FilePath = ({ item, last, currentId, folderName, clickHandler }) => {
    const dispatch = useDispatch()
    const folderStack = useSelector(state => state.files.folderStack)
    const currentFolder = useSelector(state => state.files.currentFolder)
    const tabs = [
        [
            {
                type: "create_folder",
                logo: create_new,
                name: "Новая папка",
            },
            {
                type: "upload_file",
                logo: upload_file,
                name: "Загрузить файл",
            },
            {
                type: "upload_folder",
                logo: upload_folder,
                name: "Загрузить папку",
            },
        ],
    ]
    const { isOpen, togglePopup, popupRef } = usePopupSettings()
    const [show, setShow] = useState(false)
    const handleClose = () => {setShow(false)}
    const handleClick = (e) => clickHandler(e, item, currentFolder, currentId, folderName)
    const helper = () => {
        setShow(true)
    }
    
    return (
        <div className={styles.FilePath} onClick={last ? togglePopup : handleClick}>
            <button className={styles.FilePath_wrap}>
                <div
                    className={!last
                        ? `${styles.FilePath_btn} ${styles.FilePath_btn_chevron}`
                        : styles.FilePath_btn}
                >{item.name}</div>
                {last && <img src={arrow_drop_down} className={styles.FilePath_arrow} />}
            </button>
            {!last && <img src={chevron_right} />}
            {isOpen && (
                <div ref={popupRef} className={styles.FilePath_popup}>
                    {tabs.map((tab, index) => (
                        <UploadPopupItem key={index} items={tab} helper={helper}/>
                        // костыли
                    ))}
                </div>
            )}
            <Popup show={show} handleClose={handleClose} />
        </div>
    )
}

export default FilePath