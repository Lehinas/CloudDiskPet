import React, { useEffect, useState, useRef } from "react";
import styles from "./ErrorItem.module.css";
import { useDispatch } from "react-redux";
import { removeError } from "../../../store/clientSlice"

const ErrorItem = ({ error }) => {
    const dispatch = useDispatch();
    const totalDuration = 3000;
    const [progress, setProgress] = useState(100);
    const pausedRef = useRef(false);
    const lastTimeRef = useRef(Date.now());
    
    useEffect(() => {
        lastTimeRef.current = Date.now();
        const interval = setInterval(() => {
            if (!pausedRef.current) {
                const now = Date.now();
                const delta = now - lastTimeRef.current;
                lastTimeRef.current = now;
                setProgress(prev => {
                    const newProgress = prev - (delta / totalDuration) * 100;
                    if (newProgress <= 0) {
                        clearInterval(interval);
                        dispatch(removeError(error.id));
                        return 0;
                    }
                    return newProgress;
                });
            }
        }, 50);
        return () => clearInterval(interval);
    }, [dispatch, error.id, totalDuration]);
    
    const handleMouseEnter = () => {
        pausedRef.current = true;
    };
    
    const handleMouseLeave = () => {
        lastTimeRef.current = Date.now();
        pausedRef.current = false;
    };
    
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
    );
};

export default ErrorItem;
