import React from "react"
import styles from "./UploadPopup.module.css"
import Button from "../UI/Button/Button"

import plus from "../../assets/images/plus.svg"
import upload_folder from "../../assets/images/folder_upload.svg"
import upload_file from "../../assets/images/upload_file.svg"
import create_new from "../../assets/images/create_new.svg"
import UploadPopupItem from "../UploadPopupItem/UploadPopupItem"
import usePopupSettings from "../../hooks/usePopupSettings"

const UploadPopup = () => {
    
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
    
    return (
        <div className={styles.UploadPopup}>
            <Button onClick={togglePopup} className={styles.UploadPopup_add}>
                <img src={plus} />
                <div>Добавить</div>
            </Button>
            {isOpen && (
                <div ref={popupRef} className={styles.UploadPopup_popup}>
                    {tabs.map((tab, index) => (
                        <UploadPopupItem key={index} items={tab} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default UploadPopup