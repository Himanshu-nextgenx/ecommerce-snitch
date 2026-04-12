import { BrowserRouter, createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/register.jsx";
import Login from "../features/auth/pages/login.jsx";

const routes = createBrowserRouter([

{
    path: "/",
    element: <h1>Home</h1>,
},
{
    path:"/register",
    element: <Register />
},
{
    path:"/login",
    element: <Login />
}


]);

export default routes;
