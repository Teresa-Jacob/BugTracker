import React, {Component} from "react";
import axios from 'axios'
import CloseIcon from '@mui/icons-material/Close';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../ProjectStyle/Project.css'

class ProjectList extends Component{
    
    constructor(props){
        super(props)
        this.state = {
            projects : [],
            users: []
        }

    }

    componentDidMount(){
        axios.get('http://localhost:9999/projects')
        .then(response=>{
            this.setState({
                projects: response.data
            })
            console.log(response.data)
        })
    }
    openModal = (event, projectId) => { event.stopPropagation()
      if (window.confirm("Delete this project and all associated tickets?")) {
        axios.delete(`http://localhost:9999/projects/${projectId}`)
          .then(response => {
            console.log(response);
            window.location.reload();

            // Perform any additional actions after successful deletion
          })
          .catch(error => {
            console.log(error);
            // Handle any errors that occur during the delete request
          });
      }
      
    }
    render() {
        const { projects } = this.state;
      
        return (
          <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="mt-0">Projects</h1>
          </div>
        </div>
        <div className="row align-items-start">
          {projects.map(project => (
            <div className="col-lg-6 mb-4" key={project._id}>
              
                <div className="card text-center">
                  <div className="card-body">
                  <Link to={`/project/${project._id}`} className="card-link">
                    <h5 className="card-title text-truncate">{project.title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      Created By: {project.createdby.username}
                    </h6>
                    </Link>
                    {/* <p className="card-text text-truncate">{project.description}</p> */}
                    <CloseIcon
                      onClick={(event) => this.openModal(event, project._id)}
                      className="close-icon"
                    />
                  </div>
                </div>
              
            </div>
          ))}
        </div>
      </div>
        );
      }
    }
      


export default ProjectList