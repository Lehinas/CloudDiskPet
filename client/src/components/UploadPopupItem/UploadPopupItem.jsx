import React, { useRef, useState } from "react"
import { useUploadFiles } from "../../hooks/useUploadFiles"
import Popup from "../Popup/Popup"
import UiPopup from "../UI/UIpopup/UiPopup"

const UploadPopupItem = ({ items, helper}) => {
    const [show, setShow] = useState(false)
    const fileInputRef = useRef()
    const folderInputRef = useRef()
    const { uploadHandler } = useUploadFiles()
    
    const handleClose = () => setShow(false)
    
    const uploadClickHandler = (e, item) => {
        switch (item.type) {
            case "create_folder":
                setShow(true)
                helper && helper()
                break
            case "upload_file":
                fileInputRef.current.click()
                break
            case "upload_folder":
                folderInputRef.current.click()
                break
        }
    }
    
    const layout = (item) => {
        switch (item.type) {
            case "create_folder":
                return <Popup show={show} handleClose={handleClose} />
                break
            case "upload_file":
                return (
                    <input
                        style={{ display: "none" }}
                        type="file"
                        multiple={true}
                        onChange={(e) => uploadHandler(e.target.files)}
                        ref={fileInputRef}
                    />
                )
                break
            case "upload_folder":
                return (
                    <input
                        style={{ display: "none" }}
                        type="file"
                        webkitdirectory={"true"}
                        onChange={(e) => uploadHandler(e.target.files)}
                        ref={folderInputRef}
                    />
                )
            default:
                return null
        }
    }
    
    return (
        // <div className={styles.UploadPopupItem}>
        //     {items.map((item, index) => (
        //         <button key={index} className={styles.UploadPopupItem_tab} onClick={() => uploadClickHandler(item.type)}>
        //             <img src={item.logo} className={styles.UploadPopupItem_tab_img} />
        //             <div className={styles.UploadPopupItem_tab_text}>{item.text}</div>
        //             {layout(item.type)}
        //         </button>
        //     ))}
        // </div>
        <UiPopup items={items} clickHandler={uploadClickHandler} layout={layout} />
    )
}

export default UploadPopupItem