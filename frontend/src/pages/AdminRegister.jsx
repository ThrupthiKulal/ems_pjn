import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminRegister.css';

function AdminRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    employeeId: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = [
      formData.fullName,
      formData.email,
      formData.username,
      formData.password,
      formData.confirmPassword,
      formData.phoneNumber,
      formData.employeeId,
    ];

    if (requiredFields.some((field) => !field.trim())) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setErrorMessage('');
    console.log('Admin Registration Data:', formData);
    navigate('/admin-login');
  };

  return (
    <div className="admin-register-page">
      <div className="admin-register-card">
        <div className="admin-register-header">
          <h1>Create Admin Account</h1>
          <p>Register a new admin for the Employee Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-register-form">
          <div className="admin-form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
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

            <div className="admin-form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="admin-form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="employeeId">Admin ID / Employee ID</label>
              <input
                type="text"
                id="employeeId"
                name="employeeId"
                placeholder="Enter ID"
                value={formData.employeeId}
                onChange={handleChange}
              />
            </div>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit" className="admin-register-button">
            Create Admin Account
          </button>
        </form>

        <p className="admin-login-link">
          Already have an account? <Link to="/admin-login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default AdminRegister;
