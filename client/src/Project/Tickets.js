import React, { Component } from "react";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import TicketDetails from "./TicketDetails";
import './Tickets.css'

class Tickets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tickets: [],
      users: [],
      selectedTicket: null,
      // shouldRenderTickets: true
    };
  }

  componentDidMount() {
    axios
      .get(`http://localhost:9999/projects/${this.props.projectId}/tickets`)
      .then((response) => {
        this.setState({
          tickets: response.data,
        });
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get("http://localhost:9999/users")
      .then((response) => {
        this.setState({
          users: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  openModal = (event, ticketId) => {
    event.stopPropagation();
    if (window.confirm("Delete this ticket?")) {
      axios
        .delete(
          `http://localhost:9999/projects/${this.props.projectId}/tickets/${ticketId}`
        )
        .then((response) => {
          console.log(response);
          window.location.reload();
          // Perform any additional actions after successful deletion
        })
        .catch((error) => {
          console.log(error);
          // Handle any errors that occur during the delete request
        });
    }
  };

  getUsernameById = (userId) => {
    const { users } = this.state;
    const user = users.find((user) => user._id === userId);
    return user ? user.username : "";
  };

  handleTicketClick = (ticket) => {
    this.setState({
      selectedTicket: ticket,
      shouldRenderTickets: false
    });
  };
  handleClose = () => {
    this.setState({
      selectedTicket: null,
      
    });
    window.location.reload();
  };

  render() {
    const { tickets, selectedTicket } = this.state;

    return (
      <div>
        <h1>Tickets</h1>
        <div className="ticket-list">
  {tickets.map((ticket) => (
    <div
      className={`card ticket-item ${
        selectedTicket && selectedTicket._id === ticket._id ? "selected" : ""
      }`}
      key={ticket._id}
      onClick={() => this.handleTicketClick(ticket)}
    >
      <div className="card-body text-start">
        <h5 className="card-title">{ticket.title}</h5>
        <p className="card-text">Author: {this.getUsernameById(ticket.author)}</p>
        <p className="card-text">Description: {ticket.description}</p>
        <CloseIcon
          onClick={(event) => this.openModal(event, ticket._id)}
          className="close-icon"
        />
      </div>
    </div>
  ))}
</div>
        {selectedTicket && (
          <div className="ticket-details">
            <TicketDetails
              ticketId={selectedTicket._id}
              projectId={this.props.projectId}
              onClose={this.handleClose}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Tickets;
