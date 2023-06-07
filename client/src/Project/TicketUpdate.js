import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import 'bootstrap/dist/css/bootstrap.min.css';

Modal.setAppElement('#root'); // Set the app root element for accessibility

const TicketUpdateForm = ({ projectId, ticketId, onSubmit }) => {
  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedDevs, setAssignedDevs] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:9999/projects/${projectId}/tickets`)
      .then((response) => {
        const ticketData = response.data.find((ticket) => ticket._id === ticketId);
        if (ticketData) {
          setTicket(ticketData);
          setStatus(ticketData.status);
          setPriority(ticketData.priority);
          setType(ticketData.type);
          setTitle(ticketData.title);
          setDescription(ticketData.description);
          setAssignedDevs(ticketData.assignedDevs);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [ticketId, projectId]);

  useEffect(() => {
        axios
          .get('http://localhost:9999/users')
          .then((response) => {
            setUsers(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      }, []);

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

    const handleAssignedDevsChange = (event) => {
    const devId = event.target.value;
    if (event.target.checked) {
      // Add devId to assignedDevs array
      setAssignedDevs((prevAssignedDevs) => [...prevAssignedDevs, devId]);
    } else {
      // Remove devId from assignedDevs array
      setAssignedDevs((prevAssignedDevs) =>
        prevAssignedDevs.filter((id) => id !== devId)
      );
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    // Create an updated ticket object
    const updatedTicket = {
      title,
      description,  
      status,
      priority,
      type,
      assignedDevs,
    };

    // Send the updated ticket data to the server
    axios
      .put(
        `http://localhost:9999/projects/${projectId}/tickets/${ticketId}`,
        updatedTicket
      )
      .then((response) => {
        // Handle the response
        console.log(response.data);
        onSubmit();
      })
      .catch((error) => {
        console.error(error);
      });
      setShowModal(false)
  };

  return (
    <div>
  {ticket && (
    <div>
      <button
        className="btn btn-primary"
        onClick={() => setShowModal(true)}
      >
        Update Ticket
      </button>
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Edit Ticket Modal"
        
      >
        
            <div className="modal-header">
              <h2 className="modal-title">Edit Ticket</h2>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title:
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="form-control"
                    value={title}
                    onChange={handleTitleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description:
                  </label>
                  <input
                    type="description"
                    id="description"
                    className="form-control"
                    value={description}
                    onChange={handleDescriptionChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="status" className="form-label">
                    Status:
                  </label>
                  <select
                    id="status"
                    className="form-select"
                    value={status}
                    onChange={handleStatusChange}
                  >
                    <option value="new">New</option>
                    <option value="open">Open</option>
                    <option value="inprogress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Assigned Developers:</label>
                  {users.map((user) => (
                    <div key={user._id} className="form-check">
                      <input
                        type="checkbox"
                        id={user._id}
                        className="form-check-input"
                        value={user._id}
                        checked={assignedDevs.includes(user._id)}
                        onChange={handleAssignedDevsChange}
                      />
                      <label htmlFor={user._id} className="form-check-label">
                        {user.username}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="mb-3">
                  <label htmlFor="priority" className="form-label">
                    Priority:
                  </label>
                  <select
                    id="priority"
                    className="form-select"
                    value={priority}
                    onChange={handlePriorityChange}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="type" className="form-label">
                    Type:
                  </label>
                  <select
                    id="type"
                    className="form-select"
                    value={type}
                    onChange={handleTypeChange}
                  >
                    <option value="bug">Bug Fixes</option>
                    <option value="feature">Feature Requests</option>
                    <option value="issue">Issue</option>
                    <option value="high">High</option>
                    <option value="error">Error</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">
                  Update Ticket
                </button>
              </form>
            </div>
          
      </Modal>
    </div>
  )}
</div>

  );
};

export default TicketUpdateForm;
