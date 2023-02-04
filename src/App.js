import React, { useState } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './includes/Header';
import Footer from './includes/Footer';
import Routes from './routes/Routes';

function App() {

    return (
        <>
            <Router >
                <div className="App" >
                    <Switch>
                        <Routes />
                    </Switch>
                </div>
            </Router>
            <ToastContainer toastClassName="dark-toast"
                autoClose={5000}
                className="toast-container" />
        </>
    );
}

export default App;
