import React, { useEffect } from "react"
import styles from './Uploader.module.css';
import { useDispatch, useSelector } from "react-redux";
import UploadFile from "../UploadFile/UploadFile"
import xmark from "../../assets/images/xmark.svg"
import { hideUploader } from "../../store/uploadSlice"
const Uploader = () => {
    const files = useSelector(state => state.upload.files)
    const isVisible = useSelector(state => state.upload.isVisible)
    const dispatch = useDispatch()
    
    const closeHandler = () => {
        dispatch(hideUploader())
    }
    
    return (isVisible &&
        <div className={styles.uploader}>
            <div className={styles.uploader_header}>
                <div className={styles.uploader_title}>Загрузки</div>
                <button className={styles.uploader_close} onClick={closeHandler}>
                    <img className={styles.uploader_close_img} src={xmark}/>
                </button>
            </div>
            {files?.map(file =>
                <UploadFile key={file.id} file={file} />,
            )}
        </div>
    )
}

export default Uploader