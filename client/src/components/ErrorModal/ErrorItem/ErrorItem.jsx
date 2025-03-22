// components/ErrorItem/ErrorItem.jsx
import React, { useEffect, useRef, useState } from "react"
import styles from "./ErrorItem.module.css"
import { useDispatch } from "react-redux"
import { removeError } from "../../../store/clientSlice"

const ErrorItem = ({ error, active }) => {
    const dispatch = useDispatch()
    const totalDuration = 3000
    const [progress, setProgress] = useState(100)
    const pausedRef = useRef(false)
    const lastTimeRef = useRef(Date.now())
    
    useEffect(() => {
        // Если этот ErrorItem активен запускаем отсчёт
        if (active) {
            lastTimeRef.current = Date.now()
            const interval = setInterval(() => {
                if (!pausedRef.current) {
                    const now = Date.now()
                    const delta = now - lastTimeRef.current
                    lastTimeRef.current = now
                    setProgress(prev => {
                        const newProgress = prev - (delta / totalDuration) * 100
                        if (newProgress <= 0) {
                            clearInterval(interval)
                            // Обновляем состояние асинхронно, чтобы не было обновления во время рендера
                            setTimeout(() => dispatch(removeError(error.id)), 0)
                            return 0
                        }
                        return newProgress
                    })
                }
            }, 50)
            return () => clearInterval(interval)
        } else {
            setProgress(100)
        }
    }, [active, dispatch, error.id, totalDuration])
    
    const handleMouseEnter = () => {
        pausedRef.current = true
    }
    
    const handleMouseLeave = () => {
        lastTimeRef.current = Date.now()
        pausedRef.current = false
    }
    
    return (
        <div
            className={styles.errorItem}
            onClick={() => dispatch(removeError(error.id))}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={styles.progressBar}>
                <div className={styles.progress} style={{ width: `${progress}%` }}></div>
            </div>
            <p>{error.message}</p>
        </div>
    )
}

export default ErrorItem
