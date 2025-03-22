import React from "react"
import { useSelector } from "react-redux"
import styles from "./ErrorModal.module.css"
import ErrorItem from "./ErrorItem/ErrorItem"

const ErrorModal = () => {
    const errors = useSelector(state => state.client.errors)
    if (!errors.length) return null
    
    return (
        <div className={styles.errorModal}>
            {errors.map((error, index) => (
                <ErrorItem key={error.id} error={error} active={index === 0} />
            ))}
        </div>
    )
}

export default ErrorModal
