import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    currentUser: {},
    isAuth: false,
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.isAuth = true
            state.currentUser = action.payload
        },
        logout: (state) => {
            state.isAuth = false
            state.currentUser = {}
        },
    },
})

export const { setUser, logout } = userSlice.actions
export const userReducer = userSlice.reducer