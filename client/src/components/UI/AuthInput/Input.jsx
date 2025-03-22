import React from "react"
import styles from "./Input.module.css"
import { useDispatch, useSelector } from "react-redux"
import { toggleShowPass } from "../../../store/clientSlice"

const AuthInput = ({ type, placeholder, register, errors }) => {
    const dispatch = useDispatch()
    const showPassword = useSelector(state => state.user.showPassword)
    
    return (
        <div>
            <div className={styles.input_wrapper}>
                <input
                    type={showPassword === true ? "text" : (type === "confirmPassword" ? "password" : type)}
                    className={styles.input}
                    {...register(type)}
                    placeholder={placeholder}
                />
                {type === "password" && <button
                    type={type}
                    className={`${styles.togglePassword} ${showPassword
                        ? styles.showPassword
                        : styles.hidePassword}`}
                    onClick={() => dispatch(toggleShowPass())}
                >
                </button>}
            </div>
            {errors[type] && <div className={styles.error}>{errors[type].message}</div>}
        </div>
    )
}

export default AuthInput