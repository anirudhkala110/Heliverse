import React from 'react';
import Homepage from './Components/Homepage';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import AddNew from './Components/AddNew';
import FilteredData from './Components/FilteredData';
import CreateTeam from './Components/CreateTeam';
import TeamDetail from './Components/TeamDetail';
import axios from 'axios';
axios.defaults.withCredentials=true
const App = () => {
  const handleNavigate = () => {
    window.location.reload('/')
  }
  return (
    <div>
      <a href='/' className='text-decoration-none'> <h1 className='px-3 fs-1 fw-bold shadow py-2 bg-dark text-light text-decoration-none' onClick={handleNavigate} >Heliverse</h1></a>
      <Router>
        <Routes>
          <Route exact path='/' element={<Homepage />} />
          <Route exact path='/new-entry' element={<AddNew />} />
          <Route exact path='/filter-data' element={<FilteredData />} />
          <Route exact path='/create-team' element={<CreateTeam />} />
          <Route exact path='/team-detail/:id' element={<TeamDetail />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
