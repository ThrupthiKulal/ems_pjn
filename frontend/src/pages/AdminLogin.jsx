import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminLogin.css';

function AdminLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password.trim()) {
      alert('Please enter both username and password.');
      return;
    }
    console.log('Admin Login Data:', formData);
    navigate('/admin-dashboard');
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1>Admin Access</h1>
          <p>Secure login for administrators</p>
        </div>
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label htmlFor="username">Admin Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter admin username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="admin-login-button">
            Login as Admin
          </button>
        </form>
        <p className="admin-register-link">
          Need admin access? <Link to="/admin-register">Register</Link>
        </p>
        <p className="employee-login-link">
          Are you an employee? <Link to="/login">Employee Login</Link>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
