import Button from 'react-bootstrap/Button';
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
axios.defaults.withCredentials=true
function Details(props) {
    const { user } = props;
    const [userData, setUserData] = useState([]);
    const USER_API_URL = 'https://heliverse-api.vercel.app/api/users';
    useEffect(() => {
        axios.get(`${USER_API_URL}/${user.id}`)
            .then(res => {
                console.log(res)
                setUserData(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, [user.id]);

    const [msg, setMsg] = useState()
    const [msg_type, setMsg_type] = useState()
    const navigate = useNavigate()
    const handleDelete = (id) => {
        console.log(id)
        axios.delete(`https://heliverse-api.vercel.app/api/users/${id}`)
            .then(res => {
                console.log(res.data.msg)
                setMsg(res.data.msg)
                setMsg_type(res.data.msg_type)
                setTimeout(() => {
                    setMsg(null)
                    navigate('/')
                    window.location.reload(true)
                }, 3000)
            })
            .catch(err => {
                console.log(err)
            })
    }
    const handleMissingData = (data) => {
        return data ? data : 'N/A';
    };
    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                {msg && <center className={`fw-semibold ${msg_type === 'error' ? 'text-danger' : "text-success"}`} >{msg}</center>}
                <br />
                <Modal.Title id="contained-modal-title-vcenter">
                    <div>
                        <div className='fw-bold'>Hello &nbsp;</div>
                        <div>{handleMissingData(userData.first_name)}</div>
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='d-flex justify-content-between my-4 align-items-center px-3'>
                    <div>
                        <div className='fw-bold'>Name</div>
                        <div> {handleMissingData(userData.first_name)} {handleMissingData(userData.last_name)}</div>
                    </div>
                    <div>
                        <div className='fw-bold'>Availability</div>
                        <div>{handleMissingData(userData.available ? 'Yes' : 'No')}</div>
                    </div>
                    <div>
                        <div className='fw-bold'>Domain</div>
                        <div> {handleMissingData(userData.domain)}</div>
                    </div>
                </div>
                <div className='rounded shadow px-4 py-3'>
                    <div className='mb-4 px-2'>
                        <div className='card-title fw-bold'>Gender</div>
                        <div className='card-text'>
                            {handleMissingData(userData.gender)}
                        </div>
                    </div>
                    <hr />
                    <div className=''>
                        <div className=''>
                            <div className='mb-4 w-100  '>
                                <div className='fw-bold'>Avatar</div>
                                <div className='w-100 d-flex justify-content-center'><img src={handleMissingData(userData.avatar)} width={100} height={100} /></div>
                            </div>
                            <div className='mb-4'>
                                <div className='fw-bold'>Email</div>
                                <div>{handleMissingData(userData.email)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={e => handleDelete(userData.id)} className='btn btn-danger'>Delete</Button>
                <Button onClick={props.onHide} className='btn btn-dark'>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default Details;
