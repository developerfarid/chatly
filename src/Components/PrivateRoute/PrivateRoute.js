import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

export default function PrivateRoute() {
    const user = JSON.parse(localStorage.getItem("user"))
    let location = useLocation();
    return (
        <>
            {user?.token ? <Outlet  /> : <Navigate to="/register" state={{ from: location }} />};
        </>
    )
}