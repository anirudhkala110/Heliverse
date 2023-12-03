import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';
import Button from 'react-bootstrap/Button';
import Details from './Details';

const FilteredData = () => {

    const [gender, setGender] = useState([])
    const [domain, setDomain] = useState([])
    const [available, setAvailable] = useState([])
    const [Finalgender, setFinalGender] = useState([])
    const [Finaldomain, setFinalDomain] = useState([])
    const [Finalavailable, setFinalAvailable] = useState([])
    const [userdata, setUserdata] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchText, setSearchText] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [msg, setMsg] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [changeColor, setChangecolor] = useState(null);

    // Function to show the modal for a specific user
    const handleShowModal = (user) => {
        setSelectedUser(user);
        setChangecolor(user.id);
        setModalShow(true);
    };

    const handleMissingData = (data) => {
        return data ? data : 'N/A';
    };

    const pageCount = Math.ceil(userdata.length / itemsPerPage);

    const changePage = ({ selected }) => {
        setCurrentPage(selected);
    };
    // console.log(userdata)
    const offset = currentPage * itemsPerPage;
    const currentPageData = userdata.slice(offset, offset + itemsPerPage);
    const filterUsers = (searchText) => {
        if (searchText.trim() === "") {
            setFilteredUsers([]);
            setMsg("No Data Found on search");
        } else {
            const filtered = userdata.filter((user) => {
                const first_name = (user.first_name).toLowerCase();
                const last_name = (user.last_name || '').toLowerCase();
                const domain = (user.domain || '').toLowerCase();
                const avatar = (user.avatar || '').toLowerCase();
                const available = user.available;
                const gender = (user.gender || '').toLowerCase();
                const email = (user.email || '').toLowerCase();
                return (
                    first_name.includes(searchText.toLowerCase()) ||
                    last_name.includes(searchText.toLowerCase()) ||
                    domain.includes(searchText.toLowerCase()) ||
                    email.includes(searchText.toLowerCase()) ||
                    avatar.includes(searchText.toLowerCase()) ||
                    (available && searchText.toLowerCase() === 'true') ||
                    (!available && searchText.toLowerCase() === 'false') ||
                    gender.includes(searchText.toLowerCase())
                );
            });

            if (filtered.length > 0) {
                setFilteredUsers(filtered);
                setMsg(null); // Clear any previous "No Data Found" message
            } else {
                setFilteredUsers([]);
                setMsg("No Data Found on search");
            }
        }
    };


    const handleFilterInputChange = (e) => {
        setSearchText(e.target.value);
        filterUsers(e.target.value);
    };

    const handleGender = () => {
        axios.get(`http://localhost:8096/api/gender`)
            .then(res => {
                setGender(res.data.genders)
            })
            .catch(err => {
                console.log(err)
            })
    }
    const handleDomain = () => {
        axios.get(`http://localhost:8096/api/domain`)
            .then(res => {
                setDomain(res.data.domains)
            })
            .catch(err => {
                console.log(err)
            })
    }
    const handleAvalable = () => {
        axios.get(`http://localhost:8096/api/available`)
            .then(res => {
                setAvailable(res.data.availables)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleSubmit = () => {
        console.log(Finalavailable, Finaldomain, Finalgender);

        axios.get(`http://localhost:8096/api/filtered-data`, {
            params: {
                Finalavailable,
                Finaldomain,
                Finalgender,
            },
        })
            .then(res => {
                setUserdata(res.data);
                const defaultItemsPerPage = 5;
                const dataSize = res.data.length;
                const calculatedItemsPerPage = dataSize > defaultItemsPerPage ? defaultItemsPerPage : dataSize;
                setItemsPerPage(calculatedItemsPerPage);
            })
            .catch(err => {
                console.log(err);
            });
    };


    return (
        <div className='container'>
            <div className='row'>
                <div className='col-sm-12 col-md-6 col-lg-4 col-xl-4'>
                    <button onClick={handleDomain} className="btn btn-outline-dark mb-2 me-2">Domain</button>
                    {
                        domain &&
                        <select className='form-select' onChange={e => setFinalDomain(e.target.value)}>
                            {domain.length===0 && <option selected disabled>--Click Domain to select from the list--</option>}
                            {domain.map((domain, i) => (
                                <>
                                    <option value={`${domain}`} key={domain} >{domain}</option>
                                </>
                            ))}
                        </select>
                    }
                </div>
                <div className='col-sm-12 col-md-6 col-lg-4 col-xl-4'>
                    <button onClick={handleGender} className="btn btn-outline-dark mb-2 me-2">Gender</button>
                    {
                        gender &&
                        <select className='form-select' onChange={e => setFinalGender(e.target.value)}>
                            {gender.length===0 && <option selected disabled>--Click Gender to select from the list--</option>}
                            {gender.map((gender, i) => (
                                <>
                                    <option value={`${gender}`} key={gender} >{gender}</option>
                                </>
                            ))}
                        </select>
                    }
                </div>
                <div className='col-sm-12 col-md-6 col-lg-4 col-xl-4'>
                    <button onClick={handleAvalable} className="btn btn-outline-dark mb-2 me-2">Availability</button>
                    {
                        available &&
                        <select className='form-select' onChange={e => setFinalAvailable(e.target.value)}>
                            {available.length===0 && <option selected disabled>--Click Availability to select from the list--</option>}
                            {available.map((available, i) => (
                                <>
                                    <option value={`${available}`} key={available} >{available ? 'Yes' : 'No'}</option>
                                </>
                            ))}
                        </select>
                    }
                </div>
            </div>
            <button type='submit' onClick={handleSubmit} className="btn btn-success my-2">Get Data</button>
            <div>
                <div className='p-4' style={{ background: "rgb(243 246 251)" }}>
                    <center className='my-2 card fs-3 fw-semibold'>Complete Data</center>
                    {filteredUsers.length > 0
                        ? <div className='row p-4'>
                            {
                                filteredUsers.map((dataItem, index) => (
                                    <div className="bg-light mb-2 col-6 col-sm-12 col-md-6 col-lg-4 col-xl-3" onClick={() => handleShowModal(dataItem)} key={index}>
                                        <button className='card p-2 w-100 text-start shadow'>
                                            <div>
                                                <div className='fw-bold fs-3'>{handleMissingData(dataItem.first_name)} {handleMissingData(dataItem.last_name)}</div>
                                            </div>
                                            <div>
                                                <div className='fw-bold'>Domain</div>
                                                <div> {handleMissingData(dataItem.domain)}</div>
                                            </div>
                                            <div>
                                                <div className='fw-bold'>Availability</div>
                                                <div> {handleMissingData(dataItem.available ? 'Yes' : 'No')}</div>
                                            </div>
                                        </button>
                                    </div>
                                ))}
                        </div>
                        :
                        <div>
                            {msg && <div className='mx-3 mb-4 d-flex align-items-center'>
                                {msg} <button className='btn fs-3' onClick={e => setMsg(null)}>&times;</button>
                            </div>}
                        </div>
                    }
                    {
                        filteredUsers.length <= 0 ? <>{userdata ? currentPageData.map((dataItem, index) => (
                            <div key={index} className={`text-decoration-none`} style={{ cursor: "pointer" }}>
                                <div className={`min-width-740 border py-5 px-3 mx-5 rounded shadow rounded-4 mb-2 ${changeColor === dataItem.id ? 'bg-dark text-light' : 'bg-white'}`}>
                                    <div>
                                        <div className='fw-bold'>First Name</div>
                                        <div className=''>{handleMissingData(dataItem.first_name)}</div>
                                        <div>&nbsp;</div>
                                    </div>
                                    <div>
                                        <div className='fw-bold'>Last Name</div>
                                        <div> {handleMissingData(dataItem.last_name)}</div>
                                    </div>
                                    <div>
                                        <div className='fw-bold'>Available</div>
                                        <div>{handleMissingData(dataItem.available ? 'Yes' : 'No')}</div>
                                    </div>
                                    <div>
                                        <div className='fw-bold'>Gender</div>
                                        <div> {handleMissingData(dataItem.gender)}</div>
                                    </div>
                                    <Button variant="primary" onClick={() => handleShowModal(dataItem)}>
                                        More. . .
                                    </Button>
                                </div>
                            </div>
                        )) : <div className='btn btn-danger mx-5' onClick={e => window.location.reload(true)}>Data Not present here. Backend error</div>}</> : <div className='btn btn-secondary w-100 my-5' onClick={e => window.location.reload(true)}>Main Data Not present here. Click here to go Back to the first page</div>
                    }
                    {selectedUser && (
                        <Details
                            show={modalShow}
                            user={selectedUser}
                            onHide={() => setModalShow(false)}
                        />
                    )}


                </div>
                <div class="navbar navbar-default navbar-fixed-bottom">
                    <div class="container">
                        {filteredUsers.length <= 0 && <ReactPaginate
                            className='pagination w-50'
                            previousLabel={'Previous'}
                            nextLabel={'Next'}
                            pageCount={pageCount}
                            onPageChange={changePage}
                            containerClassName={'pagination'}
                            previousLinkClassName={'page-link rounded  shadow fw-bold'}
                            nextLinkClassName={'page-link rounded shadow fw-bold'}
                            disabledClassName={'disabled'}
                            activeClassName={'active'}
                        />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FilteredData