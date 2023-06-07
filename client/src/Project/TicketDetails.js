import React, { useEffect, useState } from "react";
import axios from "axios";
import Comments from "./Comments";
import CloseIcon from "@mui/icons-material/Close";
import TicketUpdateForm from "./TicketUpdate";
import 'bootstrap/dist/css/bootstrap.min.css';

const TicketDetails = ({ ticketId, projectId, onClose }) => {
  const [ticket, setTicket] = useState(null);
  const [author, setAuthor] = useState(null);
  const [assignedDevs, setAssignedDevs] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:9999/projects/${projectId}/tickets`)
      .then(response => {
        const matchingTicket = response.data.find(ticket => ticket._id === ticketId);
        if (matchingTicket) {
          setTicket(matchingTicket);
          fetchAuthor(matchingTicket.author);
          fetchAssignedDevs(matchingTicket.assignedDevs);
        }
        console.log(matchingTicket)
      })
      .catch(error => {
        console.log(error);
      });
  }, [ticketId, projectId, formSubmitted]);

  const fetchAuthor = (authorId) => {
    axios
      .get(`http://localhost:9999/users`)
      .then(response => {
        const author = response.data.find(user => user._id === authorId);
        setAuthor(author);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const fetchAssignedDevs = (devIds) => {
    axios
      .get(`http://localhost:9999/users`)
      .then(response => {
        const assignedDevs = response.data.filter(user => devIds.includes(user._id));
        setAssignedDevs(assignedDevs);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleFormSubmit = () => {
    // setFormSubmitted(true);
    formSubmitted?setFormSubmitted(false):setFormSubmitted(true) ;
    
  };

  if (!ticket || !author) {
    return <div>Loading...</div>;
  }

  return (
    <div className="row">
  <div className="col-lg-6">
    <div>
      <CloseIcon onClick={onClose} />
    </div>
    <div>
      <TicketUpdateForm projectId={projectId} ticketId={ticketId} onSubmit={handleFormSubmit} />
    </div>
    
    <h2>{ticket.title}</h2>
    <p>Description: {ticket.description}</p>
    <p>Status: {ticket.status}</p>
    <p>Type: {ticket.type}</p>
    <p>Priority: {ticket.priority}</p>
    <p>Author: {author.username}</p>
    <p>Assigned Developers:</p>
    <ul>
      {assignedDevs.map(dev => (
        <li key={dev._id}>{dev.username}</li>
      ))}
    </ul>
  </div>
  <div className="col-lg-6">
    <div>
      <Comments projectId={projectId} ticketId={ticketId} />
    </div>
  </div>
</div>

  );
};

export default TicketDetails;
