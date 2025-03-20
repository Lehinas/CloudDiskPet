import axios from "axios";
import AuthService from "../services/AuthService"

export const API_URL = "http://localhost:5000"

export const api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

api.interceptors.request.use((config) => {
    config.headers.Authorization = localStorage.getItem('token')
    return config
})

api.interceptors.response.use((config) => {
    return config;
},async (error) => {
    const originalRequest = error.config;
    if (error.response.status == 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await AuthService.checkAuth()
            localStorage.setItem('token', response.data.tokens.accessToken);
            return api.request(originalRequest);
        } catch (e) {
            console.log('НЕ АВТОРИЗОВАН')
        }
    }
    throw error;
})

export default api;