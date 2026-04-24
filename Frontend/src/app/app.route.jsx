import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/register.jsx";
import Login from "../features/auth/pages/login.jsx";
import CreateProduct from "../features/product/pages/CreateProduct.jsx";
import Dashboard from "../features/product/pages/Dashboard.jsx";
import Protected from "../features/auth/components/Protected.jsx";
import Home from "../features/product/pages/Home.jsx";
import DetailedPage from "../features/product/pages/DetailedPage.jsx";
import SellerProductDetailed from "../features/product/pages/SellerProductDetailed.jsx";

const routes = createBrowserRouter([

{
    path: "/",
    element: <Home />
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
        path:"/product/:id",
        element: <DetailedPage/>
},
{
    path:"/seller",
    children: [
        {
            path: "create-product",
            element: <Protected role="seller">
                <CreateProduct />
            </Protected>
        },
        {
            path:"Dashboard",
            element: <Protected role="seller">
                <Dashboard />
            </Protected>

        },
        {
            path:"product/:id",
            element: <Protected role="seller">
                <SellerProductDetailed />
            </Protected>
        }
    ]
}, 




]);

export default routes;
