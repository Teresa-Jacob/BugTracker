import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './MainComponents/Login'
import Home from './MainComponents/Home'
import Dashboard from './MainComponents/Dashboard'
import PublicRoute from './Utils/PublicRoute'
import PrivateRoute from './Utils/PrivateRoute'
import ProjectDetails from './Project/ProjectDetails'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        
        <div className="content" style={{ margin: 0 }}>
          <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/login' element={<PublicRoute/>}>
            <Route path='/login' element={<Login/>} />  
          </Route>
          
          <Route path='/dashboard' element={<PrivateRoute/>} >
            <Route path='/dashboard' element={<Dashboard/>} />
          </Route>

          <Route path="/project/:id" element={<PrivateRoute/>} >
          <Route path='/project/:id' element={<ProjectDetails />} />
          </Route>


          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App