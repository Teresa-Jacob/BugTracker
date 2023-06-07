import React from 'react'
import './sidebar.css'
import { SidebarData } from './sidebarData';
import { useNavigate } from 'react-router-dom'
import { removeUserSession } from '../Utils/Common';



function Sidebar() {
    const navigate = useNavigate();
    const handleLogout = ()=>{
       
        removeUserSession()
        navigate('/login');
    }
  
    return (
    <div className="sidebar">
        <ul className="sidebarlist">
            {SidebarData.map((val, key)=>{
                return <li key={key}
                className="row" 
                id={window.location.pathname===val.link?"active": ""}
                onClick={()=>{
        
                    navigate(val.link);
                }}>
                    <div id='icon'>{val.icon}</div>
                    <div id='title'>{val.title}</div>
                    </li>
            })}
            
           <div> <input type = "button" 
                value="Log out" 
                className="logout-button"
                onClick={handleLogout}/></div>
            
        </ul>
  </div>
);
    }


export default Sidebar
