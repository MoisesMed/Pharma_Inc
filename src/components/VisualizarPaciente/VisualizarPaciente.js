/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import InfiniteScroll from 'react-infinite-scroller';
import {
    Container,
    Col, Row, Table, Modal, Button
} from "react-bootstrap";
import ActionBar from "../../components/ActionBar/ActionBar"
import moment from "moment"


import "./styles.css";

export default function VisualizarPaciente(props) {
    const { show, close, personSelected } = props
    console.log(personSelected)
    return (
        <Modal
            show={show}
            onHide={close}
            aria-labelledby="contained-modal-title-vcenter"
            size="xs"
            centered
        >
            <Modal.Body >
                <Col className="mainRowModal">
                    <img src={personSelected.picture.large} className="personImg" />
                    <button className="xButton" onClick={() => close()}>X</button>
                    <Row>
                        <Col xs={7}>
                            <Row className="rowModal">Name: {personSelected.name.first} {personSelected.name.last} </Row>
                            <Row className="rowModal">Email: {personSelected.email}</Row>
                            <Row className="rowModal">Cell: {personSelected.cell}</Row>
                            <Row className="rowModal">ID: {personSelected.id.value}</Row>
                            <Row className="rowModal">  Nationality: {personSelected.nat} </Row>
                        </Col>
                        <Col style={{ textAlign: "initial" }}>
                            <Row className="rowModal">Birth date: {moment(personSelected.dob.date).format('YYYY/MM/DD')}</Row>
                            <Row className="rowModal">Gender: {personSelected.gender}</Row>
                            <Row className="rowModal">
                                Address: {personSelected.location.street.number} {personSelected.location.street.name} </Row>
                            <Row className="rowModal">{personSelected.location.city}, {personSelected.location.state} </Row>
                            <Row className="rowModal">{personSelected.location.country}, {personSelected.location.postcode}</Row>

                        </Col>
                    </Row>
                </Col>
            </Modal.Body>
        </Modal >
    )
}
