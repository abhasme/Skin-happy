import React from "react";
import { Redirect } from 'react-router-dom'
import { Storage } from "../Storage";


const PublicRoutes = (props) => {

    const isLogin = Storage.get('user-token')
    let Comp = props.component

    if (!isLogin) {
        return (
            <Comp />
        )
    } else {
        return (
            <Redirect to="/home" />
           
        )
    }
}
export default PublicRoutes;