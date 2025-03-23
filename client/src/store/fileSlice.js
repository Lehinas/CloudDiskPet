import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    files: [],
    currentDir: null,
    currentFolder: "Мой диск",
    folderStack: [{
        name: "Мой диск",
        id: null,
    }],
    sortName: "date",
    sortType: "inc",
    fileView: "list",
    viewType: "",
    selectedFiles: [],
}

export const fileSlice = createSlice({
    name: "files",
    initialState,
    reducers: {
        setFiles: (state, action) => {
            state.files = action.payload
        },
        addFile: (state, action) => {
            state.files.push(action.payload)
        },
        setCurrentDir: (state, action) => {
            state.currentDir = action.payload
        },
        setCurrentFolder: (state, action) => {
            state.currentFolder = action.payload
        },
        pushToFolderStack: (state, action) => {
            state.folderStack.push(action.payload)
        },
        setFolderStack: (state, action) => {
            state.folderStack = action.payload
        },
        changeSortName: (state, action) => {
            state.sortName = action.payload
        },
        changeSortType: (state, action) => {
            state.sortType = action.payload
        },
        changeFileView: (state, action) => {
            state.fileView = action.payload
        },
        setViewType: (state, action) => {
            state.viewType = action.payload
        },
        addSelectedFile: (state, action) => {
            state.selectedFiles.push(action.payload)
        },
    },
})

export const {
    setFiles,
    addFile,
    setCurrentDir,
    pushToFolderStack,
    changeSortName,
    changeSortType,
    changeFileView,
    setCurrentFolder,
    setFolderStack,
    setViewType,
    addSelectedFile,
} = fileSlice.actions

export const fileReducer = fileSlice.reducer