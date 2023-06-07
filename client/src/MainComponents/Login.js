import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setUserSession } from '../Utils/Common';
import 'bootstrap/dist/css/bootstrap.min.css';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import '../MainComponentsStyle/Login.css'

const Login = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = () => {
    setError(null);
    setLoading(true);
    axios
      .post('http://localhost:9999/api/login', {
        username: username,
        password: password,
      })
      .then((response) => {
        setLoading(false);
        setUserSession(response.data.data.token, response.data.data.user);
        console.log(response.data.data.token);
        navigate('/dashboard');
      })
      .catch((error) => {
        setLoading(false);
        setError('Invalid username/password');
      });
  };

  return (
    <div className="container">
      <div className="row d-flex justify-content-center align-items-center vh-100">
      <div className="col-lg-4">
      <div className="card">
          <div className="card-body">
                
                <h2 className="mb-4">Login</h2>
                <div className="form-group">
                    <label htmlFor="username">
                    <PersonIcon /> Username
                    </label>
                    <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">
                    <LockIcon /> Password
                    </label>
                    <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p className="text-danger">{error}</p>}
                <div>
                    <button
                    type="button"
                    className="btn btn-primary"
                    value={loading ? 'Loading' : 'Log In'}
                    disabled={loading}
                    onClick={handleLogin}
                    >
                    {loading ? 'Loading' : 'Log In'}
                    </button>
                </div>
                </div>
            </div>
        </div>
        </div>
    </div>
  );
};

export default Login;
