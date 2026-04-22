import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/register.jsx";
import Login from "../features/auth/pages/login.jsx";
import CreateProduct from "../features/product/pages/CreateProduct.jsx";

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
},
{
    path:"/seller",
    element: <CreateProduct />
}


]);

export default routes;
