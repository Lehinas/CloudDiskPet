import { useAuthForm } from "../../hooks/useAuthForm"
import AuthService from "../../services/AuthService"
import { setUser } from "../../store/userSlice"
import { useDispatch } from "react-redux"
import styles from "./Auth.module.css"
import { Link, useNavigate } from "react-router-dom"
import React from "react"
import Login from "../../components/AuthLoginReg/Login"
import Registration from "../../components/AuthLoginReg/Registration"

const Auth = ({ type }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {
        register,
        formState: {
            errors,
            isSubmitting,
        },
        handleSubmit,
        reset,
        clearErrors,
    } = useAuthForm()
    
    const onSubmit = async ({
        username,
        email,
        password,
    }) => {
        switch (type) {
            case "reg":
                try {
                    const response = await AuthService.registration(email, username, password)
                    localStorage.setItem("token", response.data.tokens.accessToken)
                    dispatch(setUser(response.data.user))
                } catch (e) {
                    console.log(e)
                } finally {
                    break
                }
            case "login":
                try {
                    const response = await AuthService.login(email, password)
                    localStorage.setItem("token", response.data.tokens.accessToken)
                    dispatch(setUser(response.data.user))
                } catch (e) {
                    console.log(e)
                } finally {
                    break
                }
        }
        navigate("/disk")
    }
    
    const cleanForm = () => {
        reset()
        clearErrors()
    }
    
    return (
        <div className={styles.auth}>
            <form
                className={styles.auth_form}
                onSubmit={handleSubmit(onSubmit)}
            >
                <p className={styles.auth_form_title}>{type === "reg" ? "Регистрация" : "Вход"}</p>
                {type === "login" ?
                    <Login
                        register={register}
                        errors={errors}
                    />
                    :
                    <Registration
                        register={register}
                        errors={errors}
                    />}
                <button
                    className={styles.auth_submit}
                    type={"submit"}
                    disabled={isSubmitting || Object.keys(errors).length > 0}
                >
                    {isSubmitting ? "Загрузка" : type === "reg" ? "Зарегистрироваться" : "Войти"}
                </button>
                <Link
                    to={type === "reg" ? "/login" : "/registration"}
                    className={styles.auth_button}
                    onClick={cleanForm}
                >
                    {type === "reg" ? "Вход" : "Регистрация"}
                </Link>
            
            </form>
        
        </div>
    )
}
export default Auth