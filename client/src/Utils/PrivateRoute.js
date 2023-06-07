import React from "react";
import { Navigate, Outlet} from 'react-router-dom';
import {getToken} from "./Common"

const PrivateRoute = () =>{
    const auth = getToken()

    return auth?<Outlet/>: <Navigate to = "/login"/>



}


export default PrivateRoute