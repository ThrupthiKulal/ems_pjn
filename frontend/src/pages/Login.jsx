import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      alert('Please enter both username and password.');
      return;
    }

    try {
      const response = await api.get('/employees');
      const employees = response.data;
      
      const matchedEmployee = employees.find(
        emp => emp.name.toLowerCase() === formData.username.toLowerCase() || 
               emp.email.toLowerCase() === formData.username.toLowerCase()
      );

      if (matchedEmployee) {
        localStorage.setItem('loggedInUser', matchedEmployee.name);
        localStorage.setItem('loggedInUserId', matchedEmployee.id);
        navigate('/user-dashboard', { replace: true });
      } else {
        alert('Invalid credentials. (Note: Login using your registered Full Name or Email)');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Failed to connect to the server.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Login to your Employee Management System account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <p className="register-link">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
        <p className="admin-link">
          Are you an administrator? <Link to="/admin-login">Admin Access</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
