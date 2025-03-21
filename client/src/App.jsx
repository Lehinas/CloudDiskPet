import { useDispatch, useSelector } from "react-redux"
import "./App.css"
import Navbar from "./components/navbar/Navbar"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import AuthService from "./services/AuthService"
import { setUser } from "./store/userSlice"
import FileNavigation from "./components/FileNavigation/FileNavigation"

function App () {
    const isAuth = useSelector(state => state.user.isAuth)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const check = async () => {
        try {
            const response = await AuthService.checkAuth()
            localStorage.setItem("token", response.data.tokens.accessToken)
            dispatch(setUser(response.data.user))
            navigate("/disk")
        } catch (e) {
            if (e.response && (e.response.status === 400 || e.response.status === 401)) {
                console.log("problem")
                if (location.pathname !== "/login" && location.pathname !== "/registration") {
                    navigate("/login")
                }
            }
        }
    }
    
    useEffect(() => {
        if (!isAuth) {
            check()
        }
    }, [isAuth, navigate, location.pathname])
    
    if (isAuth) {
        return (
            <div className="App">
                <Navbar />
                <div className={"App_split"}>
                    <FileNavigation />
                    <div id="detail">
                        <Outlet />
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="App">
                <Outlet />
            </div>
        )
        
    }
}

export default App
