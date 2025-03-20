import React from "react"
import styles from "./Auth.module.css"
import Input from "../UI/Input/Input"
import AuthInput from "../UI/AuthInput/Input"

const Registration = ({register, errors}) => {
    const inputFields = [
        { type: "email", placeholder: "Email" },
        { type: "username", placeholder: "Имя пользователя" },
        { type: "password", placeholder: "Пароль" },
        { type: "confirmPassword", placeholder: "Повторите пароль" },
    ]
    
    return (
        <div className={styles.auth_input_wrapper}>
            {inputFields.map((field, index) => (
                <AuthInput
                    key={index}
                    type={field.type}
                    placeholder={field.placeholder}
                    errors = {errors}
                    register = {register}
                />
            ))}
        </div>
    )
}

export default Registration