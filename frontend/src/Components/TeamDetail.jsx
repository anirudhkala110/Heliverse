import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
axios.defaults.withCredentials=true
const TeamDetail = () => {
    const { id } = useParams();
    const [team, setTeam] = useState({});
    const [members, setMembers] = useState([]);
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        axios.get(`https://heliverse-api.vercel.app/api/team-detail/${id}`)
            .then(res => {
                setTeam(res.data);
                setMembers(res.data.users);
            })
            .catch(err => {
                console.log(err);
            });
    }, [id]);
    const [msg, setMsg] = useState()
    const [msg_type, setMsg_type] = useState()
    useEffect(() => {
        const fetchUserData = async () => {
            if (members && members.length > 0) {
                const response = await axios.get(`https://heliverse-api.vercel.app/api/details/${members}`);
                // console.log(response.data.UserData)
                setUserData(response.data.UserData);
                setMsg(response.data.msg)
                setMsg_type(response.data.msg_type)
                setInterval(() => {
                    setMsg(null)
                }, 3000)
            }
        };

        fetchUserData();
    }, [members]);


    return (
        <div className='container'>
            <center className='fs-3 fw-semibold my-2'>Team Details</center>
            <hr />
            {msg && <center className={`alert ${msg_type === 'good' ? 'fw-semibold my-2 text-success alert-success' : 'fw-semibold my-2 text-danger alert-danger'}`}>Team Details</center>}
            <center className='mb-3'>
                <label className='fw-semibold'>Team Name: &nbsp;</label>
                <span>{team.name}</span>
            </center>
            <div className='mb-3'>
                <label className='fw-semibold'>Team Members</label>
                {userData.map((memberId, i) => (
                    <div key={i} className='bg-light card p-2 shadow my-2'>
                        <div>
                            <label>Name: </label>
                            <span> {memberId.first_name} {userData.last_name} </span>
                        </div>
                        <div>
                            <label>Domain: </label>
                            <span> {memberId.domain} </span>
                        </div>
                        <div>
                            <label>Gender: </label>
                            <span> {memberId.gender}</span>
                        </div>
                        <div>
                            <label>Availability: </label>
                            <span> {memberId.available ? 'Yes' : 'No'}</span>
                        </div>
                        <div>
                            <label>Avatar: </label>
                            <img src={memberId.avatar} alt="Avatar" width={50} />
                        </div>
                        <div>
                            <label>Email: </label>
                            <span> {memberId.email}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamDetail;
