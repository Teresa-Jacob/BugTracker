import React, { Component } from "react";
import axios from 'axios'
import { getUser } from '../Utils/Common';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../ProjectStyle/ProjectForm.css'

class ProjectForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      createdby: '',
      team: [],
      availableUsernames: []
    };
  }

  componentDidMount() {
    axios.get('http://localhost:9999/users')
      .then(response => {
        const usernames = response.data.map(user => ({
          _id: user._id,
          username: user.username
        }));
        this.setState({
          availableUsernames: usernames
        });
      })
      .catch(error => {
        console.log(error);
      });

    const user = getUser();
    this.setState({
      createdby: user.username
    });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleTeamChange = (e) => {
    const selectedUserId = e.target.value;
    this.setState((prevState) => {
      const { team } = prevState;
      const updatedTeam = e.target.checked
        ? [...team, selectedUserId]
        : team.filter((memberId) => memberId !== selectedUserId);

      return {
        team: updatedTeam,
      };
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { title, description, createdby, team, availableUsernames } = this.state;

    // Find the selected user object based on the selected username
    const selectedUser = availableUsernames.find(user => user.username === createdby);

    // Extract the ID from the selected user object
    const createdbyUserId = selectedUser ? selectedUser._id : '';

    // Create the project object with the updated createdby field
    const project = {
      title,
      description,
      createdby: createdbyUserId,
      team
    };

    console.log(project);

    axios.post('http://localhost:9999/projects', project)
      .then(response => {
        console.log(response)
      });

    this.props.onSubmit();

    // Clear the form fields
    this.setState({
      title: "",
      description: "",
      createdby: "",
      team: [],
    });
  }

  render() {
    const { title, description, team, availableUsernames } = this.state;

    return (
      <div className="container scrollable-container">
  <form onSubmit={this.handleSubmit} className="mt-0">
    <div className="mb-3">
      <label htmlFor="title" className="form-label">Title</label>
      <input
        type="text"
        className="form-control"
        id="title"
        name="title"
        value={title}
        onChange={this.handleChange}
      />
    </div>

    <div className="mb-3">
      <label htmlFor="description" className="form-label">Description</label>
      <input
        type="text"
        className="form-control"
        id="description"
        name="description"
        value={description}
        onChange={this.handleChange}
      />
    </div>

    <div className="mb-3">
      <label className="form-label">Team Members</label>
      {availableUsernames.map(user => (
        <div key={user._id} className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id={`team-${user._id}`}
            name="team"
            value={user._id}
            checked={team.includes(user._id)}
            onChange={this.handleTeamChange}
          />
          <label htmlFor={`team-${user._id}`} className="form-check-label">
            {user.username}
          </label>
        </div>
      ))}
    </div>

    <div className="mb-3">
      <button type="submit" className="btn btn-primary">Submit</button>
    </div>
  </form>
</div>


    );
  }
}

export default ProjectForm;
