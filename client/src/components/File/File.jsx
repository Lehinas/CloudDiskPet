import React, { useState } from "react"
import styles from "./File.module.css"
import shareLogo from "../../assets/images/share.svg"
import downloadLogo from "../../assets/images/download.svg"
import deleteLogo from "../../assets/images/delete.svg"

import { useDispatch, useSelector } from "react-redux"
import { pushToFolderStack, setCurrentDir, setCurrentFolder } from "../../store/fileSlice"
import FileService from "../../services/FileService"
import Button from "../UI/Button/Button"
import sizeFormat from "../../utils/sizeFormat"
import { getLogo } from "../../utils/getLogo"
import FileView from "../../pages/FileView/FileView"
import useFileActions from "../../hooks/useFileActions"

const File = ({ file, isSelected }) => {
    const { name, date, size, type, path, extension, _id: fileId } = file
    const Logo = getLogo("component", extension, type) //component
    
    const dispatch = useDispatch()
    const { downloadHandler, deleteHandler, shareHandler } = useFileActions(file)
    
    const user = useSelector(state => state.user.currentUser)
    const fileView = useSelector(state => state.files.fileView)
    
    const [viewOpen, setViewOpen] = useState(false)
    const [viewData, setViewData] = useState(null)
    
    const openDirHandler = async () => {
        if (type === "dir") {
            dispatch(setCurrentDir(fileId))
            dispatch(setCurrentFolder(file.name))
            dispatch(pushToFolderStack({ name: file.name, id: fileId }))
        } else {
            try {
                const response = await FileService.getFile(fileId, user.id)
                const blob = new Blob([response.data], { type: response.data.type })
                const reader = new FileReader()
                reader.onloadend = () => {
                    const base64data = reader.result // data URI (base64)
                    setViewData({ data: base64data, extension: response.data.type.split("/")[1] })
                    setViewOpen(true)
                }
                reader.readAsDataURL(blob)
            } catch (e) {
                console.log(e)
            }
        }
    }

    return (
        <>
            {fileView === "list" ? (
                <div className={`${styles.File} ${type !== "dir" && styles.File_list_file} ${isSelected && styles.selected}`} data-file-id={fileId} onClick={openDirHandler}>
                    <Logo className={styles.File_list_img} />
                    <div className={styles.File_list_name}>{name}</div>
                    <div className={styles.File_list_date}>{date.slice(0, 10)}</div>
                    <div className={styles.File_list_size}>{sizeFormat(size)}</div>
                    {type !== "dir" && (
                        <Button
                            className={styles.File_list_btn}
                            onClick={downloadHandler}
                        ><img src={downloadLogo} /></Button>
                    )}
                    <Button className={styles.File_list_btn} onClick={shareHandler}><img src={shareLogo} /></Button>
                    <Button className={styles.File_list_btn} onClick={deleteHandler}><img src={deleteLogo} /></Button>
                </div>
            ) : (
                <div className={`${styles.File_plate} ${isSelected && styles.selected}`} data-file-id={fileId} onClick={openDirHandler}>
                    <Logo className={styles.File_plate_img} />
                    <div className={styles.File_plate_name}>{name}</div>
                    <div className={styles.File_plate_info_card}>
                        <div className={styles.File_plate_info_name}>Название: {name}</div>
                        <div className={styles.File_plate_info_time}>Дата: {date.slice(0, 10)}</div>
                        <div className={styles.File_plate_info_size}>Размер: {sizeFormat(size)}</div>
                        <div className={styles.File_plate_info_buttons}>
                            {type !== "dir" && (
                                <Button
                                    className={styles.File_plate_info_btn}
                                    onClick={downloadHandler}
                                ><img src={downloadLogo} /></Button>
                            )}
                            <Button className={styles.File_plate_info_btn}><img src={shareLogo} /></Button>
                            <Button
                                className={styles.File_plate_info_btn}
                                onClick={deleteHandler}
                            ><img src={deleteLogo} /></Button>
                        </div>
                    </div>
                </div>
            )}
            
            {viewOpen && (
                <FileView file={file} viewData={viewData} setViewOpen={setViewOpen} Logo={Logo} fileName={name} />
            )}
        </>
    )
}

export default File