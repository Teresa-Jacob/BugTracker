import React, { Component } from 'react';
import axios from 'axios';

class TeamDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            project: {},
            users: [],
        };
    }


    componentDidMount() {
        const { projectId } = this.props;

        axios.get(`http://localhost:9999/projects/${projectId}`)
            .then(response => {
                this.setState({
                    project: response.data
                });
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }
    

    render() {

        const { project } = this.state;
        return (
            <div>
                <h1>Project</h1>
                <h2>{project.title}</h2>
                <p>Description: {project.description}</p>
                <h2>Team Members</h2>
                <ul>
                    {project.team && project.team.map(member => (
                        <li key={member._id}>{member.username}</li>
                    ))}
                </ul>
                
            </div>
        );
    }
}

export default TeamDetails;
