import api from "../http"

export default class AuthService {
    static async login(email, password){
        return api.post("api/auth/login",{email, password})
    }
    static async registration(email, username, password){
        return api.post("api/auth/registration",{email, username, password})
    }
    static async checkAuth(){
        return api.get("api/auth/refresh", { _skipErrorModal: true })
    }
    static async logout(){
        return api.delete("api/auth/logout")
    }
}