import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    errors: [],
    showPassword: false,
}

const clientSlice = createSlice({
    name: "client",
    initialState,
    reducers: {
        toggleShowPass: (state) => {
            state.showPassword = !state.showPassword
        },
        addError: (state, action) => {
            state.errors.push({ id: Date.now(), message: action.payload })
        },
        removeError: (state, action) => {
            state.errors = state.errors.filter(error => error.id !== action.payload)
        },
        clearError: (state) => {
            state.error = null
        },
    },
})

export const { toggleShowPass, addError, removeError, clearError } = clientSlice.actions
export const clientReducer = clientSlice.reducer
