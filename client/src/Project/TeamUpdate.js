import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

class TeamUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            team: [],
            selectedMembers: [],
        };
    }

    componentDidMount() {
        const { projectId } = this.props;

        axios.get(`http://localhost:9999/users`)
            .then(response => {
                this.setState({
                    users: response.data,
                });
            })
            .catch(error => {
                console.error(error);
            });

        axios.get(`http://localhost:9999/projects/${projectId}`)
            .then(response => {
                this.setState({
                    team: response.data.team || [],
                    selectedMembers: response.data.team.map(member => member._id),
                });
            })
            .catch(error => {
                console.error(error);
            });
    }

    handleCheckboxChange = memberId => {
        const { selectedMembers } = this.state;

        if (selectedMembers.includes(memberId)) {
            this.setState({
                selectedMembers: selectedMembers.filter(id => id !== memberId),
            });
        } else {
            this.setState({
                selectedMembers: [...selectedMembers, memberId],
            });
        }
    };

    handleSubmit = event => {
        event.preventDefault();

        const { projectId } = this.props;
        const { selectedMembers } = this.state;

        axios.put(`http://localhost:9999/projects/${projectId}`, {
            team: selectedMembers,
        })
            .then(response => {
                console.log('Team members updated successfully:', response.data);
                this.setState({
                    submitMessage: 'Team members updated successfully!',
                });
            })
            .catch(error => {
                console.error('Error updating team members:', error);
                // Handle error cases
            });

            this.props.onSubmit(); 
    };

    render() {
        const { users, selectedMembers } = this.state;

        return (
            <div className="container">
  <div className="row">
    <div className="col">
      <h2>Team Update</h2>
      <form onSubmit={this.handleSubmit}>
        <div className="mb-3">
          
          {users.map(user => (
            <div className="form-check" key={user._id}>
              <input
                className="form-check-input"
                type="checkbox"
                value={user._id}
                checked={selectedMembers.includes(user._id)}
                onChange={() => this.handleCheckboxChange(user._id)}
              />
              <label className="form-check-label">{user.username}</label>
            </div>
          ))}
        </div>
        <button type="submit" className="btn btn-primary">Update Team</button>
      </form>
    </div>
  </div>
</div>

        );
    }
}

export default TeamUpdate;
