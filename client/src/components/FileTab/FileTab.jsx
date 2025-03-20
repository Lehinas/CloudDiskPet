import React from "react"
import styles from "./FileTab.module.css"
import { Link, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"

const FileTab = ({ item }) => {
    const { logo, text, href } = item
    const location = useLocation()
    return (
        <Link
            to={href}
            className={location.pathname === href ? `${styles.FileTab} ${styles.FileTab_active}` : styles.FileTab}
        >
            <img src={logo} className={styles.FileTab_img} />
            <div className={styles.FileTab_text}>{text}</div>
        </Link>
    )
}

export default FileTab