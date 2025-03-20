import React from "react"
import styles from "./Button.module.css"

const Button = ({ onClick, children, className }) => {
    return (
        <button onClick={onClick} className={` ${className} ${styles.btn}`}>
            {children}
        </button>
    )
}

export default Button