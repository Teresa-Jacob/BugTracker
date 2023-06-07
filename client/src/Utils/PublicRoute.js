import React from "react";
import {Navigate, Outlet } from 'react-router-dom';
import {getToken} from "./Common"

const PublicRoute = () =>{
    const auth = getToken()

    return !auth?<Outlet/>: <Navigate to = "/dashboard"/>



}
export default PublicRoute