import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import { store } from "./store/store"
import { Provider } from "react-redux"
import Auth from "./pages/Auth/Auth"
import Disk from "./pages/Disk/Disk"
import NotFound from "./pages/NotFound/NotFound"

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/disk",
                element: <Disk />,
            },
            {
                path: "*",
                element: <NotFound />,
            },
            {
                path: "/registration",
                element: <Auth type={"reg"} />,
            },
            {
                path: "/login",
                element: <Auth type={"login"} />,
            },
        ],
    },

])

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>,
)

