import React, { useState } from "react"
import styles from "./FilterItem.module.css"
import arrow_drop_down from "../../assets/images/arrow_drop_down.svg"
import pdfLogo from "../../assets/images/pdfLogo.svg"
import imageLogo from "../../assets/images/imageLogo.svg"
import videoLogo from "../../assets/images/videoLogo.svg"
import dirLogo from "../../assets/images/dirLogo.svg"
import cross from "../../assets/images/cross.svg"
import usePopupSettings from "../../hooks/usePopupSettings"
import { useDispatch } from "react-redux"
import { setViewType } from "../../store/fileSlice"
import UiPopup from "../UI/UIpopup/UiPopup"

const FilterItem = ({ item }) => {
    const { type } = item
    const [name, setName] = useState(item.name)
    const { isOpen, togglePopup, popupRef } = usePopupSettings()
    const dispatch = useDispatch()
    const clickHandler = (e, item) => {
        const {type, name} = item
        setName(name)
        dispatch(setViewType(type))
    }
    const cleanType = (e) => {
        e.stopPropagation()
        setName(item.name)
        dispatch(setViewType(""))
    }
    const filters = [
        { type: "pdf", name: "Файлы PDF", logo: pdfLogo },
        { type: "image", name: "Изображения", logo: imageLogo },
        { type: "video", name: "Видео", logo: videoLogo },
        { type: "dir", name: "Папки", logo: dirLogo },
    ]
    return (
        <div className={styles.FilterItem} onClick={togglePopup}>
            <button
                className={name !== item.name
                    ? `${styles.FilterItem_btn} ${styles.FilterItem_btn_active}`
                    : styles.FilterItem_btn}
            >
                <div>{name}</div>
                <img src={arrow_drop_down} className={styles.FilterItem_img} />
            </button>
            {name !== item.name && (
                <>
                    <button
                        className={name !== item.name
                            ? `${styles.FilterItem_clean} ${styles.FilterItem_clean_active}`
                            : styles.FilterItem_clean} onClick={cleanType}
                    >
                        <img src={cross} />
                    </button>
                </>
            )}
            {isOpen && <UiPopup clickHandler={clickHandler} items={filters} ref={popupRef}/>}
        </div>
    )
}

export default FilterItem