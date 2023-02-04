import React, { useEffect } from 'react'
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch
} from 'react-router-dom';
import Home from '../container/Home';
import Login from '../login/Login';
import ProtectedRoutes from "./ProtectedRoutes";
import PublicRoutes from './PublicRoutes';
import Details from '../container/Details';
import TagManage from '../container/TagManage';
import AddDiagnosis from '../container/AddDiagnosis';
import CompleteDetail  from '../container/CompleteDetail';

export default function Routes({ isStateChange }) {
    // useEffect(() => {
    //     isStateChange(userDetails())
    // }, [window.location.pathname])
    return (
    <>
       
        <Route exact path="/home">
            <ProtectedRoutes Cmp={Home} />
        </Route>
        <Route exact path="/details">
            <ProtectedRoutes Cmp={Details} />
        </Route>
        <Route exact path="/tag-manager">
            <ProtectedRoutes Cmp={TagManage} />
        </Route>
        <Route exact path="/add-diagnosis">
            <ProtectedRoutes Cmp={AddDiagnosis} />
        </Route>
        <Route exact path="/completed-details">
            <ProtectedRoutes Cmp={CompleteDetail} />
        </Route>
        <Route exact path="*">
            <PublicRoutes component={Login} />
        </Route>
       
    </>
    )
}
