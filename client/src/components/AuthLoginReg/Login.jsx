import React from "react"
import Input from "../UI/Input/Input"
import styles from "./Auth.module.css"
import AuthInput from "../UI/AuthInput/Input"
const Login = ({register, errors}) => {
    const inputFields = [
        { type: "email", placeholder: "Email" },
        { type: "password", placeholder: "Пароль" },
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

export default Login
