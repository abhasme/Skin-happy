import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import { toast } from "react-toastify";
import { Storage } from "../Storage";
export default function Header() {
    const history = useHistory();
    const [user, setUser] = useState(Storage.get('user-token').data.name)
    const logout = () => {
        localStorage.removeItem("user-token");
        history.push("/");
        toast.success("Logged out successfull")
    };
    const manageTag = () => {
        history.push("/tag-manager")
    }
    return (
        <header>
            <Navbar bg="" expand="lg">
                <Container fluid>
                    <Navbar.Brand href="">
                        <img src="/assets/images/logo.png" height="40" className ="all-cursor" onClick={()=>history.push('/home')}/>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Dropdown align="end" className="d-inline mx-2" autoClose="outside">
                                <Dropdown.Toggle id="dropdown-autoclose-outside">
                                    <img src="/assets/images/photo.png" /> &nbsp; {user}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item href="#" onClick={() => manageTag()}>Manage Tags</Dropdown.Item>
                                    <Dropdown.Item href="#" onClick={() => logout()}>
                                        Logout
                                    </Dropdown.Item>
                                    {/* <Dropdown.Item href="#">Menu Item</Dropdown.Item> */}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
}
