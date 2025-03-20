import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    files: [],
    isVisible: false,
}

export const uploadSlice = createSlice({
    name: "upload",
    initialState,
    reducers: {
        showUploader: (state, action) => {
            state.isVisible = true
        },
        hideUploader: (state, action) => {
            state.isVisible = false
        },
        addUploadFile: (state, action) => {
            state.files.push(action.payload)
        },
        changeProgress: (state, action) => {
            state.files = state.files.map(file => file.id == action.payload.id
                ? { ...file, progress: action.payload.progress }
                : { ...file },
            )
        },
    },
})

export const { showUploader, hideUploader, addUploadFile, changeProgress } = uploadSlice.actions

export const uploadReducer = uploadSlice.reducer