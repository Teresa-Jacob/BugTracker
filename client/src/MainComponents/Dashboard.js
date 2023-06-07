import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { getUser } from '../Utils/Common';
import Sidebar from '../Sidebar/sidebar';
import '../Sidebar/sidebar.css'
import ProjectList from '../Project/Project';
import '../MainComponentsStyle/Dashboard.css'
import ProjectForm from '../Project/ProjectForm';
import Modal from 'react-modal';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
    
    
    const [showForm, setShowForm] = useState(false);

  const handleNewProjectClick = () => {
    setShowForm(true);
  };

  const handleFormSubmit = () => {
    
    setShowForm(false); // Close the form after submission
    window.location.reload();
  };
  const handleModalClose = () => {
    setShowForm(false); // Close the form when the modal is closed
  };
    return(
        

      <div className="container-fluid">
  <div className="row mt-4">
    <div className="col-lg-2">
      <Sidebar />
    </div>
    <div className="col-lg-10">
      <div className="Projects">
        <div className="row justify-content-between">
          <div className="col-6">
            <h1>DASHBOARD</h1>
          </div>
          <div className="col-6 text-end">
            <button className="btn btn-primary" onClick={handleNewProjectClick}>
              New Project
            </button>
          </div>
        </div>
        
          <ProjectList />
       
        <div>
        <Modal isOpen={showForm} onRequestClose={handleModalClose} className="modal-dialog-centered">
  <div className="modal-dialog modal-dialog-centered modal-lg">
    <div className="modal-content">
      <div className="modal-header mt-4">
        <h5 className="modal-title">Create Project</h5>
        <button type="button" className="btn-close" onClick={handleModalClose}></button>
      </div>
      <div className="modal-body">
        <ProjectForm onSubmit={handleFormSubmit} />
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={handleModalClose}>Close</button>
        <button type="submit" className="btn btn-primary">Submit</button>
      </div>
    </div>
  </div>
</Modal>

        </div>
      </div>
    </div>
  </div>
</div>

        
        
    )
}

export default Dashboard