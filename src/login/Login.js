import React, { useState, useRef } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { authServices } from "../services/authServices";
import { toast } from "react-toastify";
import { useHistory } from "react-router";
import { Storage } from "../Storage";
import SimpleReactValidator from "simple-react-validator";

export default function Login() {
  const [, forceUpdate] = useState("");
  const [user, setUser] = useState({
    input: "",
    password: "",
  });

  const history = useHistory();
  const validator = useRef(
    new SimpleReactValidator({ autoForceUpdate: { forceUpdate: forceUpdate } })
  );

  const setChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const submitLogin = () => {
    const formValid = validator.current.allValid();
    if (formValid) {
      authServices.login(user).then((res) => {
        if (res.status === true) {
          Storage.set("user-token", res);
          toast.success(res.message);
          Storage.set('flag', 'new')
          history.push("/home");
        } else {
          toast.error(res.message);
        }
      });
    } else {
      validator.current.showMessages();
    }
  };

  return (
    <div className="loginpage">
      <Container fluid>
        <Row>
          <Col md={4} className="mx-auto">
            <div className="text-center logo_login">
              <img src="/assets/images/logo.png" height="60" />
            </div>
            <Form className="pt-5">
              <Form.Group className="input_gap" controlId="formBasicEmail">
                <Form.Label className="small text-white">Username</Form.Label>
                <Form.Control
                  onChange={(e) => setChange(e)}
                  name="input"
                  value={user.input}
                  type="email"
                  placeholder="Enter username"
                />
                {validator.current.message(
                  "email",
                  user.input,
                  "required|email",
                  {
                    className: "text-danger",
                  }
                )}
              </Form.Group>
              <Form.Group className="input_gap" controlId="formBasicPassword">
                <Form.Label className="small text-white">Password</Form.Label>
                <Form.Control
                  onChange={(e) => setChange(e)}
                  name="password"
                  value={user.password}
                  type="password"
                  placeholder="Enter password"
                />
                {validator.current.message(
                  "password",
                  user.password,
                  "required",
                  { className: "text-danger" }
                )}
              </Form.Group>
              <a onClick={() => submitLogin()} className="theme-btn btn w-100">
                Login
              </a>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
