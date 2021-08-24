/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import InfiniteScroll from 'react-infinite-scroller';
import {
    Container, Button, InputGroup, FormControl, Form,
    Col, Row, Table, Spinner, Dropdown, DropdownButton, ButtonGroup
} from "react-bootstrap";
import ActionBar from "../../components/ActionBar/ActionBar"
import moment from "moment"
import VisualizarPaciente from "../../components/VisualizarPaciente/VisualizarPaciente"

import { api } from "../../api"

import "./styles.css";

export default function Home() {
    const [results, setResults] = useState([])
    const [list, setList] = useState(results)
    const [inputData, setInputData] = useState("")
    const [page, setPage] = useState(2)
    const [show, setShow] = useState(false)
    const [personSelected, setPersonSelected] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [orderName, setOrderName] = useState(false)
    const [orderGender, setOrderGender] = useState(false)
    const [qtd, setQtd] = useState([50])
    const [nat, setNat] = useState(false)
    const [name, setName] = useState(true)


    useEffect(() => {
        const handleSearch = () => {
            if (inputData === "") {
                setList(results)
            } else {
                setList(
                    nat ?
                        list.filter(item => (item.nat.toLowerCase().indexOf(inputData.toLowerCase()) > -1)) :
                        list.filter(item => (item.name.first.toLowerCase().indexOf(inputData.toLowerCase()) > -1))
                )
            }
        }
        handleSearch()
    }, [inputData])

    const handleOrderName = () => {
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
        setOrderName(true)
        setList(newList)
        setOrderGender(false)
    }

    const handleOrderGender = () => {
        let newList = [...results];
        newList.sort((a, b) => {
            if (a.gender > b.gender) {
                return 1
            } else {
                if (b.gender > a.gender) {
                    return -1
                } else {
                    return 0
                }
            }
        })
        setOrderGender(true)
        setList(newList)
        setOrderName(false)
    }

    useEffect(() => {
        const getData = async () => {
            setIsLoading(true)
            try {
                const response = await api.get(`?results=${qtd}&seed=abcde`)
                setResults(response.data.results)
                setList(response.data.results)
            } catch (erro) {
                console.log(erro)
            } finally {
                setIsLoading(false)
            }
        }
        getData()
        setOrderGender(false)
        setOrderName(false)
    }, [])

    const moreData = async () => {
        setIsLoading(true)
        try {
            const response = await api.get(`?results=${qtd}&seed=abcde&page=${page}`)
            const newArray = [...results, ...response.data.results]
            setResults(newArray)
            setList(newArray)
        } catch (erro) {
            console.log(erro)
        } finally {
            setIsLoading(false)
            setPage(page + 1)
            setInputData("")
        }
    }
    const showModal = (item) => {
        setShow(true);
        setPersonSelected(item);
    }

    const closeModal = (item) => {
        setShow(false)
    }

    const changeChecked = () => {
        setName(!name)
        setNat(!nat)
    }

    return (
        <Container className="mainContainer">
            <br />
            <text style={{ width: "60%", textAlign: "center", fontFamily: "Roboto" }}>
                We at Pharma Inc, always thinking of offering our best services, developed this website to make the management and visualization of our patients' information more efficient and streamline our service.
            </text>
            <text style={{ width: "50%", textAlign: "center", fontFamily: "Roboto", marginTop: 8 }}>
                In the list below, you can search for patients by name and nationality. You can also sort the NAME table alphabetically.
            </text>
            <br />
            <Row>
                <Col className="colInputSearch">
                    <input
                        className="form-input-search"
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                        id="input-table"
                        placeholder="Search for name or nationality"
                    />
                </Col>
                <Col>
                    <Row style={{ justifyContent: "center" }}>
                        Name
                    </Row>
                    <Row style={{ textAlign: "center" }}>
                        <Form.Check
                            inline
                            type={"checkbox"}
                            value={name}
                            checked={name}
                            onClick={() => changeChecked()}
                        />
                    </Row>
                </Col>
                <Col>
                    <Row style={{ justifyContent: "center" }}>
                        Nationality
                    </Row>
                    <Row style={{ textAlign: "center" }}>
                        <Form.Check
                            inline
                            type={"checkbox"}
                            value={nat}
                            checked={nat}
                            onClick={() => changeChecked()}
                        />
                    </Row>
                </Col>
            </Row>
            <br />
            <DropdownButton as={ButtonGroup} title="Quantity for Load " id="bg-vertical-dropdown-1" variant="secondary">
                <Dropdown.Item onClick={() => setQtd(10)} eventKey="1">10</Dropdown.Item>
                <Dropdown.Item onClick={() => setQtd(25)} eventKey="2">25</Dropdown.Item>
                <Dropdown.Item onClick={() => setQtd(50)} eventKey="3">50</Dropdown.Item>
            </DropdownButton>
            <br />
            <InfiniteScroll
                pageStart={page}
                hasMore={true || false}
                loader={
                    <div className="divSpinner">
                        {isLoading ?
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading more...</span>
                            </Spinner> : null}

                        <button onClick={() => { moreData() }} style={{ display: "contents" }}>
                            <text style={{ margin: 12 }}>Click to load more !</text>
                        </button>
                    </div>
                }
            >
                <Table striped hover style={{
                    margin: 0, width: "100%", textAlign: "center",
                    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", borderRadius: 12
                }}>
                    <thead>
                        <tr>
                            <th style={{ fontFamily: "Roboto", borderTop: 0 }}>
                                <button onClick={() => handleOrderName()} style={{ display: "contents", fontWeight: 700 }}>Name</button>
                                {orderName ?
                                    <img src="https://img.icons8.com/material-outlined/24/000000/alphabetical-sorting.png" />
                                    : null}
                            </th>
                            <th style={{ fontFamily: "Roboto", borderTop: 0 }}>Nationality</th>
                            <th style={{ fontFamily: "Roboto", borderTop: 0 }}>
                                <button onClick={() => handleOrderGender()} style={{ display: "contents", fontWeight: 700 }}>Gender</button>
                                {orderGender ?
                                    <img src="https://img.icons8.com/material-outlined/24/000000/alphabetical-sorting.png" />
                                    : null}
                            </th>
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
        </Container >
    )
}
