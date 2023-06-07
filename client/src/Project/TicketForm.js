import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUser } from '../Utils/Common';
import 'bootstrap/dist/css/bootstrap.min.css';

const TicketForm = ({ projectId , onSubmit}) => {
    const user = getUser()
    console.log(user._id)
    console.log('wJHHHHhhhh')
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState(user._id);
  const [status, setStatus] = useState('new');
  const [priority, setPriority] = useState('high');
  const [type, setType] = useState('bug');
  const [assignedDevs, setAssignedDevs] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:9999/projects/${projectId}`)
      .then(response => {
        const teamMembers = response.data.team || [];
        setTeamMembers(teamMembers);
        console.log('Team members')
        console.log(teamMembers)
      })
      .catch(error => {
        console.error(error);
      });
  }, [projectId]);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

//   const handleAuthorChange = (event) => {
//     setAuthor(event.target.value);
//   };
  
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleAssignedDevsChange = (event) => {
    const devId = event.target.value;
    if (event.target.checked) {
      // Add devId to assignedDevs array
      setAssignedDevs(prevAssignedDevs => [...prevAssignedDevs, devId]);
    } else {
      // Remove devId from assignedDevs array
      setAssignedDevs(prevAssignedDevs => prevAssignedDevs.filter(id => id !== devId));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Create a new ticket object
    const newTicket = {
      title,
      description,
      author,
      status,
      priority,
      type,
      assignedDevs,
    };

    // Send the new ticket data to the server
    axios.post(`http://localhost:9999/projects/${projectId}/tickets`, newTicket)
      .then(response => {
        // Handle the response
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
      onSubmit()
    // Reset the form fields
    setTitle('');
    setDescription('');
    setAuthor(user._id);
    setStatus('new');
    setPriority('high');
    setType('bug');
    setAssignedDevs([]);
  };

  return (
    <div className="container">
  <h2>Create a New Ticket</h2>
  <form onSubmit={handleSubmit}>
    <div className="mb-3">
      <label htmlFor="title" className="form-label">Title:</label>
      <input type="text" id="title" className="form-control" value={title} onChange={handleTitleChange} />
    </div>
    <div className="mb-3">
      <label htmlFor="description" className="form-label">Description:</label>
      <textarea id="description" className="form-control" value={description} onChange={handleDescriptionChange} />
    </div>
    <div className="mb-3">
      <label htmlFor="status" className="form-label">Status:</label>
      <select id="status" className="form-select" value={status} onChange={handleStatusChange}>
        <option value="new">New</option>
        <option value="open">Open</option>
        <option value="inprogress">In Progress</option>
        <option value="resolved">Resolved</option>
        <option value="other">Other</option>
      </select>
    </div>
    <div className="mb-3">
      <label htmlFor="priority" className="form-label">Priority:</label>
      <select id="priority" className="form-select" value={priority} onChange={handlePriorityChange}>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </div>
    <div className="mb-3">
      <label htmlFor="type" className="form-label">Type:</label>
      <select id="type" className="form-select" value={type} onChange={handleTypeChange}>
        <option value="bug">Bug Fixes</option>
        <option value="feature">Feature Requests</option>
        <option value="issue">Issue</option>
        <option value="high">High</option>
        <option value="error">Error</option>
        <option value="other">Other</option>
      </select>
    </div>
    <div className="mb-3">
      <label className="form-label">Assigned Developers:</label>
      {teamMembers.map(member => (
        <div className="form-check" key={member._id}>
          <input
            type="checkbox"
            id={member._id}
            className="form-check-input"
            value={member._id}
            checked={assignedDevs.includes(member._id)}
            onChange={handleAssignedDevsChange}
          />
          <label htmlFor={member._id} className="form-check-label">{member.username}</label>
        </div>
      ))}
    </div>
    <button type="submit" className="btn btn-primary">Create Ticket</button>
  </form>
</div>

  );
};

export default TicketForm;
