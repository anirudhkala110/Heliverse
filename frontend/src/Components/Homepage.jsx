import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Button from 'react-bootstrap/Button';
import Details from './Details';
import { Link, useNavigate } from 'react-router-dom';
const Homepage = () => {
    const [userdata, setUserdata] = useState([]);
    const [address, setAddress] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchText, setSearchText] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [msg, setMsg] = useState(null);

    axios.defaults.withCredentials = true
    useEffect(() => {
        axios.get('https://heliverse-api.vercel.app/api/users')
            .then(res => {
                setUserdata(res.data);
                setAddress(res.data.address);
                const defaultItemsPerPage = 20;
                const dataSize = res.data.length;
                const calculatedItemsPerPage = dataSize > defaultItemsPerPage ? defaultItemsPerPage : dataSize;
                setItemsPerPage(calculatedItemsPerPage);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

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
    const navigate = useNavigate();

    const handleCreateTeamClick = () => {
        navigate('/create-team');
    };

    return (
        <div className='min-vh-100' style={{ background: "rgb(243 246 251)" }}>
            <div className="search-bar w-100 px-4 d-flex align-items-center">
                <input
                    type="text"
                    className='form-control w-75 me-1'
                    placeholder="Search any keyword..."
                    value={searchText}
                    onChange={handleFilterInputChange}
                />
                <Link to='/new-entry'>
                    <button className='btn btn-outline-success ms-1'>Add</button>
                </Link>
                <Link to='/filter-data'>
                    <button className='btn btn-outline-warning ms-1'>Filter</button>
                </Link>
                <Link to={{ pathname: '/create-team', state: { users: userdata } }}>
                    <button className='btn btn-outline-primary ms-1' onClick={handleCreateTeamClick}>
                        Create Team
                    </button>
                </Link>
            </div>
            <div className='pt-4' style={{ background: "rgb(243 246 251)" }}>
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
    );
};

export default Homepage;
