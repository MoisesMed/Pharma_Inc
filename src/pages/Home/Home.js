import React from "react";
import {
    Container,

} from "react-bootstrap";
import TableList from "../../components/TableList/TableList"

import "./styles.css";

export default function Home() {
    return (
        <Container className="mainContainer">
            <TableList />
        </Container >
    )
}