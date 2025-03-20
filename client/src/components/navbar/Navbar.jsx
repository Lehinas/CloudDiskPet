import React from "react"
import styles from "./Navbar.module.css"
import Logo from "../../assets/images/google_logo.svg"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import avatar from "../../assets/images/avatar_def.svg"
import Search from "../Search/Search"

const Navbar = () => {
    const isAuth = useSelector(state => state.user.isAuth)
    const user = useSelector(state => state.user.currentUser)
    return (
        <div className={styles.navbar}>
            <div className={styles.navbar_logo}>
                <img src={Logo} alt={"navbar_logo"} className={styles.navbar_logo_img}></img>
                <Link to={"/disk"} className={styles.navbar_title}>Cloud</Link>
            </div>
            <Search />
            <div className={styles.navbar_auth}>
                {!isAuth && <Link to={"/login"} className={styles.navbar_login}>Войти</Link>}
                {!isAuth && <Link to={"/registration"} className={styles.navbar_reg}>Регистрация</Link>}
                {isAuth && (
                    <div className={styles.navbar_user}>
                        <Link to={"/"} className={styles.navbar_username}>{user.username}</Link>
                        <img src={avatar} />
                    </div>
                )}
            </div>
        </div>
    
    )
}

export default Navbar