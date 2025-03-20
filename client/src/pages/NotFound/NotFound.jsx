import React from "react"
import styles from "./NotFound.module.css"
import unluck from "../../assets/images/sad-penguin.jpg"
import { useLocation } from "react-router-dom"
const NotFound = () => {
    
    const location = useLocation()
    const locationText = location.pathname.split("").slice(1,).join("") // чтобы убрать /
    return (
        <div className={styles.NotFound}>
            <div>Страница: {locationText}</div>
            <div>Не разработано!</div>
            <img src={unluck}/>
        </div>
    )
}

export default NotFound