import React, { useEffect, useRef, useState } from "react"
import styles from "./FileView.module.css"

import { ReactComponent as CrossLogo } from "../../assets/images/cross.svg"
import { ReactComponent as FileLogo } from "../../assets/images/file.svg"
import { ReactComponent as ShareLogo } from "../../assets/images/share.svg"
import { ReactComponent as DownloadLogo } from "../../assets/images/download.svg"
import { ReactComponent as DeleteLogo } from "../../assets/images/delete.svg"
import FileViewContent from "../../components/FileViewContent/FileViewContent"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"
import useFileActions from "../../hooks/useFileActions"
import { createPortal } from "react-dom"

const FileView = ({ viewData, setViewOpen, Logo, file }) => {
    const { data, extension } = viewData
    const { name } = file
    
    const { downloadHandler, deleteHandler, shareHandler } = useFileActions(file)
    
    const contentRef = useRef(null)
    const [scrolled, setScrolled] = useState(false)
    
    useEffect(() => {
        const current = contentRef.current
        const handleScroll = () => {
            if (current.scrollTop > 0 && !scrolled) {
                setScrolled(true)
            }
            if (current.scrollTop < 10 && scrolled) {
                setScrolled(false)
            }
        }
        
        if (current) {
            current.addEventListener("scroll", handleScroll)
        }
        
        return () => {
            if (current) {
                current.removeEventListener("scroll", handleScroll)
            }
        }
    }, [scrolled])
    
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setViewOpen(false)
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [setViewOpen])
    
    return createPortal(
        <div className={styles.FileView_popup}>
            <div
                className={scrolled
                    ? `${styles.FileView_popup_navbar} ${styles.FileView_popup_navbar_scrolled}`
                    : styles.FileView_popup_navbar}
            >
                <div className={styles.FileView_popup_navbar_about}>
                    <button
                        onClick={() => setViewOpen(prev => !prev)}
                        className={styles.FileView_popup_navbar_about_cross}
                    >
                        <CrossLogo />
                    </button>
                    {Logo ? <Logo className={styles.FileView_popup_navbar_about_logo} /> :
                        <FileLogo className={styles.FileView_popup_navbar_about_logo} />}
                    <button className={styles.FileView_popup_navbar_about_name}>{name}</button>
                </div>
                <div className={styles.FileView_popup_navbar_btns}>
                    <button className={styles.FileView_popup_navbar_btn} onClick={downloadHandler}>
                        <DownloadLogo />
                    </button>
                    <button className={styles.FileView_popup_navbar_btn} onClick={deleteHandler}>
                        <DeleteLogo />
                    </button>
                    <button className={styles.FileView_popup_navbar_btn} onClick={shareHandler}>
                        <ShareLogo />
                    </button>
                </div>
            </div>
            <div className={styles.FileView_content} ref={contentRef}>
                <FileViewContent data={data} extension={extension} />
            </div>
        </div>,
        document.body,
    )
}

export default FileView
