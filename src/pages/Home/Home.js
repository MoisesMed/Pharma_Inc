/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import InfiniteScroll from 'react-infinite-scroller';
import {
    Container, Button,
    Col, Row, Table, Spinner
} from "react-bootstrap";
import ActionBar from "../../components/ActionBar/ActionBar"
import moment from "moment"

import VisualizarPaciente from "../../components/VisualizarPaciente/VisualizarPaciente"

import { api } from "../../api"

import "./styles.css";

export default function Home() {
    const [data, setData] = useState([])
    const [page, setPage] = useState(0)
    const [show, setShow] = useState(false)
    const [personSelected, setPersonSelected] = useState([])

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await api.get("?results=10&seed=hi")
                setData(response.data.results)
            } catch (erro) {
                console.log(erro)
            }
        }
        getData()
    }, [])

    const moreData = async () => {
        try {
            const response = await api.get(`?results=10&seed=abcde&page=${page}`)
            const newArray = [...data, ...response.data.results]
            setData(newArray)
        } catch (erro) {
            console.log(erro)
        } finally {
            setPage(page + 1)
        }
    }

    const showModal = (item) => {
        setShow(true);
        setPersonSelected(item);
    }

    const closeModal = (item) => {
        setShow(false)
    }

    return (
        <Container className="mainContainer">
            <br />
            <text>texto aqui</text>
            <br />
            <input></input>
            <br />
            <InfiniteScroll
                pageStart={page}
                loadMore={moreData}
                hasMore={true || false}
                loader={
                    <div className="divSpinner">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading more...</span>
                        </Spinner>
                        <text style={{ margin: 12 }}>Loading more...</text>
                    </div>
                }
            >
                <Table striped bordered hover style={{ margin: 0, width: "100%", textAlign: "center" }}>
                    <thead>
                        <tr>
                            <th style={{ fontFamily: "Roboto" }}>Name</th>
                            <th style={{ fontFamily: "Roboto" }}>Gender</th>
                            <th style={{ fontFamily: "Roboto" }}>Birth Date</th>
                            <th style={{ fontFamily: "Roboto" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody >
                        {data.map((item) =>
                            <tr>
                                <td style={{ fontFamily: "Roboto", width: 220 }}>{item.name.first} {item.name.last}</td>
                                <td style={{ fontFamily: "Roboto", width: 150 }}>{item.location.country}</td>
                                <td style={{ fontFamily: "Roboto", width: 150 }}>{moment(item.dob.date).format('YYYY/MM/DD')}</td>
                                <td style={{ fontFamily: "Roboto", width: 100 }}>
                                    <Button className="viewButton" variant="secondary" onClick={() => showModal(item)}>View</Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                    {show ? <VisualizarPaciente show={show} close={closeModal} personSelected={personSelected} /> : null}

                </Table>
            </InfiniteScroll>
        </Container>
    )
}
