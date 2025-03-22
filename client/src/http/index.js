import axios from "axios"
import AuthService from "../services/AuthService"
import { store } from "../store/store"
import { addError } from "../store/clientSlice"

export const API_URL = process.env.REACT_APP_API_URL
export const api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
})

api.interceptors.request.use((config) => {
    config.headers.Authorization = localStorage.getItem("token")
    return config
})

api.interceptors.response.use((response) => {
    return response
}, async (error) => {
    const originalRequest = error.config
    if (error.response.status === 401 && originalRequest && !originalRequest._isRetry) {
        originalRequest._isRetry = true
        try {
            const response = await AuthService.checkAuth()
            localStorage.setItem("token", response.data.tokens.accessToken)
            return api.request(originalRequest)
        } catch (e) {
            console.log("НЕ АВТОРИЗОВАН")
        }
    }
    if (!originalRequest._skipErrorModal) {
        store.dispatch(addError(error.response.data.message || "Ошибка сервера"))
    }
    throw error
})

export default api
