import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Button from 'react-bootstrap/Button';
import Details from './Details';
import { Link, useNavigate } from 'react-router-dom';
const CreateTeam = () => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [teamName, setTeamName] = useState('');
    const [users, setUsers] = useState();
    const [msg, setMsg] = useState(null);
    const [msg_type, setMsg_type] = useState()
    axios.defaults.withCredentials=true
    const createTeam = async () => {
        console.log(selectedUsers);

        try {
            const response = await axios.post('https://heliverse-api.vercel.app/api/teams', {
                selectedUsers,teamName
            });
setMsg(response.data.msg)
            setMsg_type(response.data.msg_type)
            console.log(response.data)
            if (response.data.msg_type === 'good') {
                setTeams([...teams, response.data.newTeam]);
                setSelectedUsers([]);
                setTeamName('');
            }
            else {
                alert("Please enter all the information")
                setInterval(() => {
                    setMsg(null)
                }, 5000)
            }
        } catch (error) {
            console.error('Error creating team:', error);
        }
    };

    const [allTeams, setAllteams] = useState([]);
    useEffect(() => {
        axios
            .get('https://heliverse-api.vercel.app/api/teams')
            .then((res) => {
                setAllteams(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const [userdata, setUserdata] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        axios
            .get('https://heliverse-api.vercel.app/api/creating-team')
            .then((res) => {
                setUserdata(res.data);
                const defaultItemsPerPage = res.data.length;
                const dataSize = res.data.length;
                const calculatedItemsPerPage = dataSize > defaultItemsPerPage ? defaultItemsPerPage : dataSize;
                setItemsPerPage(calculatedItemsPerPage);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    const [changeColor, setChangecolor] = useState(null);

    const handleMissingData = (data) => {
        return data ? data : 'N/A';
    };

    const offset = currentPage * itemsPerPage;
    const currentPageData = userdata.slice(offset, offset + itemsPerPage);

    return (
        <div className="container mt-5">
            <h2>Create Team</h2>

            <div className="mb-3">
                <label>Team Name:</label>
                <input
                    type="text"
                    className="form-control"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label>Select Users: ( Using Ctrl + Mouse Left Click )</label>
                <select
                    multiple
                    className="form-control"
                    value={selectedUsers}
                    onChange={(e) =>
                        setSelectedUsers(
                            Array.from(e.target.selectedOptions, (option) => option.value)
                        )
                    }
                >
                    {filteredUsers.length <= 0 ? (
                        <>
                            {userdata ? (
                                currentPageData.map((dataItem, index) => (
                                    <option
                                        key={index}
                                        className={`text-decoration-none`}
                                        style={{ cursor: 'pointer' }}
                                        value={dataItem._id}
                                    >
                                        <div
                                            className={` border py-5 px-3 mx-5 rounded shadow rounded-4 mb-2 ${changeColor === dataItem.id
                                                ? 'bg-dark text-light'
                                                : 'bg-white'
                                                } `}
                                        >
                                            <div className="">
                                                <div className="">
                                                    <div className="d-flex justify-content-between align-items-center border border-black w-100">
                                                        <div className="me-2">{index + 1}</div>.&nbsp;&nbsp;&nbsp;
                                                        <div className="me-2">
                                                            {handleMissingData(dataItem.first_name)}{' '}
                                                            {handleMissingData(dataItem.last_name)}
                                                        </div>
                                                        &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                                                        <div className="me-2">{dataItem.domain}</div>
                                                        &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                                                        <div className="me-2">
                                                            {handleMissingData(
                                                                dataItem.available ? 'Yes' : 'No'
                                                            )}
                                                        </div>
                                                        &nbsp;&nbsp;&nbsp;
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </option>
                                ))
                            ) : (
                                <div
                                    className="btn btn-danger mx-5"
                                    onClick={(e) => window.location.reload(true)}
                                >
                                    Data Not present here. Backend error
                                </div>
                            )}
                        </>
                    ) : (
                        <div
                            className="btn btn-secondary w-100 my-5"
                            onClick={(e) => window.location.reload(true)}
                        >
                            Main Data Not present here. Click here to go Back to the first
                            page
                        </div>
                    )}
                </select>
            </div>
            <button className="btn btn-primary" onClick={createTeam}>
                Create Team
            </button>

            <hr />

            <h2>New Teams - {teams.length}</h2>

            <ul className="list-group">
                {teams.map((team, index) => (
                    <Link to={`/team-detail/${team._id}`} className='text-decoration-none'>
                        <li
                            key={team._id}
                            className="list-group-item"
                            style={{ cursor: 'pointer' }}
                        >
                            {index + 1} - {team.name} - Members: {team.users.length}
                        </li>
                    </Link>
                ))}
            </ul>
            <hr />
            {allTeams.length > 0 && (
                <>
                    <h2>Previous Teams</h2>
                    <ul
                        className="list-group p-1"
                        style={{ maxHeight: '500px', overflow: 'auto' }}
                    >
                        {allTeams.map((team, index) => (
                            <Link
                                to={`/team-detail/${team._id}`}
                                className="text-decoration-none rounded mb-1 shadow"
                                key={team._id}
                            >
                                <li
                                    className="list-group-item"
                                    style={{ cursor: 'pointer' }}
                                >
                                    {index + 1} - {team.name} - Members: {team.users.length}
                                </li>
                            </Link>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default CreateTeam;
