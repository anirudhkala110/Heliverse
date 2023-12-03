import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const AddNew = () => {
    const [Newdata, setNewData] = useState([{
        first_name: '',
        last_name: '',
        email: '',
        gender: '',
        domain: '',
        avatar: '',
        availablility: 1
    }])
    const [msg, setMsg] = useState()
    const [msg_type, setMsg_type] = useState()
    const handleAvatarChange = (e) => {
        const inputValue = e.target.value;
        // Check if the input value is a valid URL
        if (isValidUrl(inputValue)) {
            setNewData({ ...Newdata, avatar: inputValue });
        } else {
            // Handle invalid URL (you can show an error message or take other actions)
            console.error('Invalid URL');
            alert('Invalid URL')
        }
    };

    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    };

    const navigate = useNavigate()
    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:8096/api/users', {
            ...Newdata, first_name: Newdata.first_name,
            last_name: Newdata.last_name,
            email: Newdata.email,
            gender: Newdata.gender,
            domain: Newdata.domain,
            avatar: Newdata.avatar,
            availablility: Newdata.availablility
        })
            .then(res => {
                console.log(res.data.msg)
                setMsg(res.data.msg)
                setMsg_type(res.data.msg_type)
                setTimeout(() => {
                    setMsg(null)
                    navigate('/')
                }, 3000)
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div className='container-fluid d-flex align-items-center justify-content-center py-3' style={{ minHeight: "90vh" }}>
            <form className='form border shadow rounded p-2' onSubmit={handleSubmit} style={{ minWidth: '350px' }}>
                <center className='fs-3 fw-semibold' >Add New User</center>
                {msg && <center className={`fw-semibold ${msg_type === 'error' ? 'text-danger' : "text-success"}`} >{msg}</center>}

                <hr />
                <div className='form-group mb-2'>
                    <label className="form-label" >First Name</label>
                    <input className='form-control' type='text' placeholder='' onChange={e => setNewData({ ...Newdata, first_name: e.target.value })} required />
                </div>
                <div className='form-group mb-2'>
                    <label className="form-label" >Last Name</label>
                    <input className='form-control' type='text' placeholder='' onChange={e => setNewData({ ...Newdata, last_name: e.target.value })} required />
                </div>
                <div className='form-group mb-2'>
                    <label className="form-label" >Email</label>
                    <input className='form-control' type='email' placeholder='' onChange={e => setNewData({ ...Newdata, email: e.target.value })} required />
                </div>
                <div className='form-group mb-2'>
                    <label className="form-label" >Gender</label>
                    <select className='form-select' placeholder='' onChange={e => setNewData({ ...Newdata, gender: e.target.value })} required >
                        <option selected>Select Gender</option>
                        <option value={'Male'}>Male</option>
                        <option value={'Female'}>Female</option>
                        <option value={'Agender'}>Agender</option>
                        <option value={'Bigender'}>Bigender</option>
                        <option value={'Genderfluid'}>Genderfluid</option>
                        <option value={'Genderqueer'}>Genderqueer</option>
                        <option value={'Non-binary'}>Non-binary</option>
                        <option value={'Polygender'}>Polygender</option>
                    </select>
                </div>
                <div className='form-group mb-2'>
                    <label className="form-label" >Avatar</label>
                    <input className='form-control' type='text' placeholder='Provide the complete link / Paste URL' onChange={e => handleAvatarChange(e)} required />
                </div>
                <div className='form-group mb-2'>
                    <label className="form-label" >Domain</label>
                    <input className='form-control' type='text' placeholder='Work Field' onChange={e => setNewData({ ...Newdata, domain: e.target.value })} required />
                </div>
                <div className='form-group mb-2'>
                    <label className="form-label" >Your availablility</label>
                    <select className='form-select' onChange={e => setNewData({ ...Newdata, availablility: e.target.value })} required >
                        <option selected>Choose availablility</option>
                        <option value={1} >Yes</option>
                        <option value={0} >No</option>
                    </select>
                </div>
                <button type='submit' className='btn btn-success w-100' >Add Data</button>
            </form>
        </div>
    )
}

export default AddNew