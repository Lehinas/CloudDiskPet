import React from "react"
import styles from "./FilePathMore.module.css"
import chevron_right from "../../assets/images/chevron_right.svg"
import moreHoriz from "../../assets/images/moreHoriz.svg"
import dirLogo from "../../assets/images/dirLogo.svg"
import usePopupSettings from "../../hooks/usePopupSettings"
import UiPopup from "../UI/UIpopup/UiPopup"
import { useSelector } from "react-redux"

const FilePathMore = ({ items, clickHandler }) => {
    
    const currentFolder = useSelector(state => state.files.currentFolder)
    
    const { isOpen, togglePopup, popupRef } = usePopupSettings()
    const itemsWithLogo = items.map(item => ({
        ...item,
        logo: dirLogo,
    }))
    
    const handleClick = (e, item) => clickHandler(e, item, currentFolder, item.id, item.name)
    return (
        <div className={styles.FilePathMore}>
            <button className={styles.FilePathMore_btn} onClick={togglePopup}>
                <img src={moreHoriz} />
            </button>
            <img src={chevron_right} className={styles.FilePathMore_chevron} />
            {isOpen && <UiPopup items={itemsWithLogo} ref={popupRef} clickHandler={handleClick} />}
        </div>
    )
}

export default FilePathMore