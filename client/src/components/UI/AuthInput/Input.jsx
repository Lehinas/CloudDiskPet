import React, { useState } from "react"
import styles from "./Input.module.css"

const AuthInput = ({ type, placeholder, register, errors }) => {
    const [showPass, setShowPass] = useState(false)
    return (
        <div>
            <div className={styles.input_wrapper}>
                <input
                    type={showPass === true ? "text" : (type === "confirmPassword" ? "password" : type)}
                    className={styles.input}
                    {...register(type)}
                    placeholder={placeholder}
                />
                {type === "password" && <button
                    type={type}
                    className={`${styles.togglePassword} ${showPass
                        ? styles.showPassword
                        : styles.hidePassword}`}
                    onClick={() => setShowPass(!showPass)}
                >
                </button>}
            </div>
            {errors[type] && <div className={styles.error}>{errors[type].message}</div>}
        </div>
    )
}

export default AuthInput