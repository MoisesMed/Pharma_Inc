/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import {
    Container,
    Col, Row, Navbar, Nav, NavDropdown
} from "react-bootstrap";

import "./styles.css";

import account from "../../assets/img/account_login.svg";

export default function ActionBar() {

    return (
        <Navbar className="navBarMain" bg="light" expand="lg">
            <Navbar.Brand href="#home">Pharma Inc</Navbar.Brand>
            <Nav.Link href="#home"
                style={{ right: 10 }}>
                <img src={account} />
            </Nav.Link>


        </Navbar>
    );
};




