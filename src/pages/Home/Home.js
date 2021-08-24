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
    const [results, setResults] = useState([])
    const [list, setList] = useState(results)
    const [inputData, setInputData] = useState(" ")
    const [page, setPage] = useState(0)
    const [show, setShow] = useState(false)
    const [personSelected, setPersonSelected] = useState([])

    useEffect(() => {
        if (inputData === "") {
            setList(results)
        } else {
            setList(
                list.filter(item => (item.name.first.toLowerCase().indexOf(inputData.toLowerCase()) > -1))
            )
        }
    }, [inputData])

    const handleOrder = () => {
        let newList = [...results];
        newList.sort((a, b) => {
            if (a.name.first > b.name.first) {
                return 1
            } else {
                if (b.name.first > a.name.first) {
                    return -1
                } else {
                    return 0
                }
            }
        })

        setList(newList)
    }

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await api.get("?results=10&seed=abcde")
                setResults(response.data.results)
                setList(response.data.results)
            } catch (erro) {
                console.log(erro)
            }
        }
        getData()
    }, [])

    const moreData = async () => {
        try {
            const response = await api.get(`?results=10&seed=abcde&page=${page}`)
            const newArray = [...results, ...response.data.results]
            setResults(newArray)
            setList(newArray)
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
            <div>
                <input
                    className="form-input"
                    onChange={(e) => setInputData(e.target.value)}
                    id="input-table"
                    placeholder="Ache um Usuario"
                />
                <button>Name</button>
                <button>Nationality</button>
            </div>
            <br />
            <InfiniteScroll
                pageStart={page}
                hasMore={true || false}
                loader={
                    <button onClick={() => { moreData() }} style={{ display: "contents" }}>
                        <div className="divSpinner">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading more...</span>
                            </Spinner>
                            <text style={{ margin: 12 }}>Load more...</text>
                        </div>
                    </button>
                }
            >
                <Table striped hover style={{
                    margin: 0, width: "100%", textAlign: "center",
                    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", borderRadius: 12
                }}>
                    <thead>
                        <tr>
                            <th style={{ fontFamily: "Roboto", borderTop: 0 }}>
                                Name <button onClick={() => handleOrder()} style={{ display: "contents" }}><img src="https://img.icons8.com/material-outlined/24/000000/alphabetical-sorting.png" /></button>
                            </th>
                            <th style={{ fontFamily: "Roboto", borderTop: 0 }}>Nationality</th>
                            <th style={{ fontFamily: "Roboto", borderTop: 0 }}>Gender</th>
                            <th style={{ fontFamily: "Roboto", borderTop: 0 }}>Birth Date</th>
                            <th style={{ fontFamily: "Roboto", borderTop: 0 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody >
                        {list.map((item) =>
                            <tr>
                                <td style={{ fontFamily: "Roboto", width: 200 }}>{item.name.first} {item.name.last}</td>
                                <td style={{ fontFamily: "Roboto", width: 80 }}>{item.nat}</td>
                                <td style={{ fontFamily: "Roboto", width: 120 }}>{item.gender}</td>
                                <td style={{ fontFamily: "Roboto", width: 130 }}>{moment(item.dob.date).format('MM/DD/YYYY')}</td>
                                <td style={{ fontFamily: "Roboto", width: 90 }}>
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
