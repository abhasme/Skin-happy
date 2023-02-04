import React from "react";
import { Redirect } from "react-router-dom";
import { Storage } from "../Storage";
import Header from '../includes/Header';

const ProtectedRoutes = (props) => {

    const Component = props.Cmp
    const isLogin = Storage.get("user-token")

    if (!isLogin) {
        return (
            <Redirect to="/login" />
        )

    } else {
        return (
            <>
                <Header />
                <Component />
            </>
        )
    }
}
export default ProtectedRoutes;