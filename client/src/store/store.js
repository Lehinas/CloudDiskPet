import { configureStore } from "@reduxjs/toolkit"
import { userReducer } from "./userSlice"
import { fileReducer } from "./fileSlice"
import { uploadReducer } from "./uploadSlice"

export const store = configureStore({
    reducer: {
        user: userReducer,
        files: fileReducer,
        upload: uploadReducer,
    },
})