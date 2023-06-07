import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../Sidebar/sidebar';
import TeamDetails from './TeamDetails';
import TeamUpdate from './TeamUpdate';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-modal';
import TicketForm from './TicketForm';
import Ticket from './Tickets';

// function ProjectDetails() {
//     const params = useParams();
//     const [showForm, setShowForm] = useState(false);

//     const handleTeamUpdateClick = () => {
//         setShowForm(true);
//     };

//     const handleFormSubmit = () => {
//         setShowForm(false); // Close the form after submission
//         window.location.reload();
//     };

//     const handleModalClose = () => {
//         setShowForm(false); // Close the form when the modal is closed
//     };
    
  
//     console.log(params); 
  
//     return (
//         <div>
//             <Sidebar />
//             <div className="content">
//                 <TeamDetails projectId={params.id} />
//                 <button onClick={handleTeamUpdateClick}>Update Team</button>
//                 <Modal
//                     isOpen={showForm}
//                     onRequestClose={handleModalClose}
//                 >
//                     <TeamUpdate
//                         projectId={params.id}
//                         onSubmit={handleFormSubmit}
//                     />
//                 </Modal>
//                 <TicketForm projectId={params.id}/>
//             </div>
//         </div>
//     );
//   }

// export default ProjectDetails;
Modal.setAppElement('#root');

const ProjectDetails = () => {
  const params = useParams();
  const [showTeamUpdateForm, setShowTeamUpdateForm] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);

  const handleTeamUpdateClick = () => {
    setShowTeamUpdateForm(true);
  };

  const handleTicketFormClick = () => {
    setShowTicketForm(true);
  };

  const handleFormSubmit = () => {
    setShowTeamUpdateForm(false); // Close the team update form after submission
    setShowTicketForm(false); // Close the ticket form after submission
    window.location.reload();
  };

  const handleModalClose = () => {
    setShowTeamUpdateForm(false); // Close the team update form when the modal is closed
    setShowTicketForm(false); // Close the ticket form when the modal is closed
  };

  return (
    <div className="container-fluid">
  <div className="row">
    <div className="col-lg-2">
      <Sidebar />
    </div>
    <div className="col-lg-10">
    <div className="row">
        <div className="col-lg-6">
          
      <div className="content">
        <TeamDetails projectId={params.id} />
        <div className="mt-3">
          <button className="btn btn-primary" onClick={handleTeamUpdateClick}>
            Update Team
          </button>
          
        </div>
        <Modal isOpen={showTeamUpdateForm} onRequestClose={handleModalClose} className="modal-dialog-centered">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                
                <button type="button" className="btn-close" onClick={handleModalClose}></button>
              </div>
              <div className="modal-body">
                <TeamUpdate projectId={params.id} onSubmit={handleFormSubmit} />
              </div>
            </div>
          </div>
        </Modal>
        </div>
        </div>
        <div className="col-lg-6 mt-4">
        <button className="btn btn-primary" onClick={handleTicketFormClick}>
            Create Ticket
          </button>
        <Modal isOpen={showTicketForm} onRequestClose={handleModalClose} >
          
                <TicketForm projectId={params.id} onSubmit={handleFormSubmit} />
            
        </Modal>
        <Ticket projectId={params.id} />
      </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default ProjectDetails;