import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.scss";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import CreateGroupView from "./pages/CreateGroup/CreateGroup.jsx";
import ManageGroup, {loader as manageGroupLoader,} from "./pages/ManageGroup/ManageGroup.jsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {ThemeProvider} from "@mui/material/styles";
import {theme} from "./themes/themes.js";
import ErrorPage from "./pages/Error/error.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <CreateGroupView/>,
    },
    {
        path: "/:groupId",
        element: <ManageGroup/>,
        loader: manageGroupLoader,
    },
    {
        path: "/error",
        element: <ErrorPage/>,
    },
]);

createRoot(document.getElementById("root")).render(
    <ThemeProvider theme={theme}>
        <StrictMode>
            <RouterProvider router={router}/>
        </StrictMode>
    </ThemeProvider>,
);
