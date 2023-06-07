import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../MainComponentsStyle/Register.css';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';

function Register() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');


  const navigate = useNavigate();

  const handleRegister = () => {
    setError(null);
    setLoading(true);
  
    axios
      .post('http://localhost:9999/api/register', {
        username: username,
        password: password,
        email: email,
      })
      .then((response) => {
        if (response.data.status === 'ok') {
          axios
            .post('http://localhost:9999/api/send', {
              email: email,
            })
            .then((response) => {
              setLoading(false);
              console.log(response);
              if (response.data === 'error') {
                setError("Email does not exist");
              } else {
                setEmail('');
                setUsername('');
                setPassword('');
                setMessage('Account created successfully! Please verify to login.');
              }
            })
            .catch((error) => {
              setLoading(false);
              console.log('Error sending email:', error);
            });
        } else {
          setError(response.data.error);
        }
        setLoading(false);
      });
  };
  
      

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="row d-flex justify-content-center">
        
          <div className="card">
            <div className="card-body">
              <h2>Register</h2>
              <div className="form-group">
                <label>
                  <PersonIcon /> Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>
                  <LockIcon /> Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>
                  <EmailIcon /> Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {error && <p className="error">{error}</p>}
              {message && <p className="message">{message}</p>}
              <button
                type="button"
                className="btn btn-primary"
                disabled={loading}
                onClick={handleRegister}
              >
                {loading ? 'Loading' : 'Create Account'}
              </button>
              <button
                type="button"
                className="btn btn-link"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          </div>
        
      </div>
    </div>
  );
}

export default Register;
