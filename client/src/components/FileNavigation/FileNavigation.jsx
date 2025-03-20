import React from "react"
import styles from "./FileNavigation.module.css"
import UploadPopup from "../UploadPopup/UploadPopup"

import home from "../../assets/images/home.svg"
import folder from "../../assets/images/folder.svg"
import recent from "../../assets/images/recent.svg"
import share from "../../assets/images/share.svg"
import FileTab from "../FileTab/FileTab"

const FileNavigation = () => {
    
    const tabs = [
        { logo: home, text: "Главная", href: "/home" },
        { logo: folder, text: "Мой диск", href: "/disk" },
        { logo: recent, text: "Недавние", href: "/recent" },
        { logo: share, text: "Поделились со мной", href: "/shared" },
    ]
    
    return (
        <aside className={styles.FileTabs}>
            <UploadPopup />
            <div className={styles.FileTabs_tabs}>
                {tabs.map((tab, i) => <FileTab key={i} item={tab} />)}
            </div>
        </aside>
    )
}

export default FileNavigation