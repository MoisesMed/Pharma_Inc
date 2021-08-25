import React, { useState, useEffect, useRef } from "react";
import InfiniteScroll from 'react-infinite-scroller';
import {
    Container,
    Button,
    Table,
    Spinner,
} from "react-bootstrap";
import moment from "moment"
import VisualizarPaciente from "../../components/VisualizarPaciente/VisualizarPaciente"
import arrow from "../../assets/img/arrow.svg"

import { api } from "../../api"

import "./styles.css";

export default function TableList() {
    const [results, setResults] = useState([])
    const [list, setList] = useState(results)
    const [page, setPage] = useState(2)
    const [show, setShow] = useState(false)
    const [personSelected, setPersonSelected] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [orderName, setOrderName] = useState(false)
    const [orderGender, setOrderGender] = useState(false)
    const [qtd, setQtd] = useState([50])

    const [visible, setVisible] = useState(false)

    const toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 400) {
            setVisible(true)
        }
        else if (scrolled <= 400) {
            setVisible(false)
        }
    };

    window.addEventListener('scroll', toggleVisible);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const refSearch = useRef()
    const refFilterSearch = useRef()

    const handleSearch = (searchValue) => {
        if (!searchValue) {
            return setList(results);
        }

        if (!!refFilterSearch.current.value) {
            searchValue = searchValue.toLowerCase();

            if (refFilterSearch.current.value === 'all') {
                const newList = results.filter((person) => {
                    const nation = person.nat
                        .toLowerCase()
                        .includes(searchValue);

                    const name = String(
                        `${person.name.first} ${person.name.last}`
                    )
                        .toLowerCase()
                        .includes(searchValue);

                    const date = moment(person.dob.date)
                        .format('MM/DD/YYYY')
                        .toLowerCase()
                        .includes(searchValue);

                    return nation || name || date;
                });

                return setList(newList);
            }
            if (refFilterSearch.current.value === 'name') {
                const newList = results.filter((person) => {
                    const name = String(
                        `${person.name.first} ${person.name.last}`
                    )
                        .toLowerCase()
                        .includes(searchValue);

                    return name;
                });

                return setList(newList);
            }
            if (refFilterSearch.current.value === 'nation') {
                const newList = results.filter((person) => {
                    const nation = person.nat
                        .toLowerCase()
                        .includes(searchValue);

                    return nation;
                });

                return setList(newList);
            }
        }
    };

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
            if (!!refSearch.current.value) {
                handleSearch(refSearch.current.value)
            }
        } catch (erro) {
            console.log(erro)
        } finally {
            setIsLoading(false)
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
            <text style={{ width: "60%", textAlign: "center", fontFamily: "Roboto", fontSize: 17, fontWeight: 500, marginTop: 20 }}>
                We at Pharma Inc, always thinking of offering our best services, developed this website to make the management and visualization of our patients' information more efficient and streamline our service.
            </text>
            <text style={{ width: "50%", textAlign: "center", fontFamily: "Roboto", marginTop: 8, fontSize: 17, fontWeight: 500 }}>
                In the list below, you can search for patients by name and nationality. You can also sort the NAME table alphabetically.
            </text>
            <input
                className="form-input-search"
                ref={refSearch}
                onChange={(e) => handleSearch(e.target.value)}
                id="input-table"
                placeholder="Search for name or nationality"
            />

            <div className="form-search-container">
                <select
                    size="sm"
                    defaultValue={String(qtd)}
                    className="form-input-search"
                    onChange={(e) => {
                        setQtd(Number.parseInt(e.target.value))
                    }
                    }
                >
                    <option value="10">10 person</option>
                    <option value="25">25 person</option>
                    <option value="30">30 person</option>
                    <option value="50">50 person</option>
                </select>

                <select
                    size="sm"
                    defaultValue="all"
                    className="form-input-search"
                    ref={refFilterSearch}
                    onChange={() => {
                        if (!!refSearch.current.value) {
                            return handleSearch(refSearch.current.value)
                        }
                    }}
                >
                    <option value="all">Search all with filters</option>
                    <option value="name">Only search by name</option>
                    <option value="nation">Only search by nation</option>
                </select>
            </div>
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
            <img style={{ display: visible ? 'inline' : 'none' }} onClick={() => scrollToTop()} className="toTop" src={arrow} />
        </Container >
    )
}