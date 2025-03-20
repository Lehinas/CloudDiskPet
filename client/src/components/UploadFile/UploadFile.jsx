import React from "react"
import styles from "./UploadFile.module.css"
import { useDispatch } from "react-redux"
import xmark from "../../assets/images/xmark_black.svg"

const UploadFile = ({ file }) => {
    const dispatch = useDispatch()
    return (
        <div className={styles.upload_file}>
            <div className={styles.upload_file_header}>
                <div className={styles.upload_file_name}>{file.name}</div>
                <button className={styles.upload_file_remove}>
                    <img className={styles.upload_file_remove_img} src={xmark} />
                </button>
            </div>
            <div className={styles.upload_file_progress_bar}>
                <div className={styles.upload_file_upload_bar} style={{ width: file.progress + "%" }} />
                <div className={styles.upload_file_percent}>{file.progress}%</div>
            </div>
        </div>
    )
}

export default UploadFile
