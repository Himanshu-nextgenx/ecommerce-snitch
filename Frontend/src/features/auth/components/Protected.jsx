import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const Protected = ({ children, role = "buyer" }) => {
    const { user ,loading} = useSelector((state) => state.auth);
    console.log("Protected State:", { user, loading, role }); 

    if (loading) {
    console.log("⏳ LOADING - wait kar raha hun");
    return <div>Loading...</div>;
  }
    if (!user) {
        return <Navigate to="/login" />;
    }
    if (user.role !== role) {
        return <Navigate to="/" />;
    }
    
  return children  ? children : <Outlet />;;
};

export default Protected;
