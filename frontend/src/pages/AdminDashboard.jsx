import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Employees');
  
  // Employee State
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: ''
  });

  // Task State
  const [tasks, setTasks] = useState([]);
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    assignedToId: '',
    dueDate: '',
    priority: 'LOW'
  });

  useEffect(() => {
    fetchEmployees();
    fetchTasks();
  }, []);

  // --- Employee Methods ---
  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees", error);
    }
  };

  const handleEmployeeChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editEmployeeId) {
        await api.put(`/employees/${editEmployeeId}`, formData);
      } else {
        await api.post('/employees', formData);
      }
      fetchEmployees();
      resetEmployeeForm();
    } catch (error) {
      console.error("Error saving employee", error);
    }
  };

  const handleEditEmployee = (employee) => {
    setEditEmployeeId(employee.id);
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      position: employee.position
    });
    setShowAddForm(true);
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await api.delete(`/employees/${id}`);
        fetchEmployees();
      } catch (error) {
        console.error("Error deleting employee", error);
      }
    }
  };

  const resetEmployeeForm = () => {
    setFormData({ name: '', email: '', phone: '', department: '', position: '' });
    setEditEmployeeId(null);
    setShowAddForm(false);
  };

  // --- Task Methods ---
  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  const handleTaskChange = (e) => {
    setTaskFormData({ ...taskFormData, [e.target.name]: e.target.value });
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      // Find the employee object to send in the payload
      const assignedEmployee = employees.find(emp => emp.id === parseInt(taskFormData.assignedToId));
      if (!assignedEmployee) {
        alert("Please select a valid employee");
        return;
      }

      const newTask = {
        title: taskFormData.title,
        description: taskFormData.description,
        assignedTo: assignedEmployee,
        assignedBy: "Admin",
        assignedDate: new Date().toISOString().split('T')[0],
        dueDate: taskFormData.dueDate,
        priority: taskFormData.priority,
        status: "ASSIGNED"
      };

      await api.post('/tasks', newTask);
      alert("Task successfully assigned!");
      fetchTasks();
      
      // Reset Task Form
      setTaskFormData({
        title: '',
        description: '',
        assignedToId: '',
        dueDate: '',
        priority: 'LOW'
      });
    } catch (error) {
      console.error("Error saving task", error);
      alert("Failed to assign task");
    }
  };


  const handleLogout = () => {
    if (window.confirm("Do you want to log out?")) {
      navigate('/admin-login');
    }
  };

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-container">
        <header className="admin-dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Manage employees and system settings</p>
        </header>

        <div className="admin-dashboard-content">
          <div className="admin-dashboard-card">
            <h3>Total Employees</h3>
            <p className="stat">{employees.length}</p>
          </div>
          <div className="admin-dashboard-card">
            <h3>Total Tasks</h3>
            <p className="stat">{tasks.length}</p>
          </div>
          <div className="admin-dashboard-card">
            <h3>Recent Actions</h3>
            <p className="stat">12</p>
          </div>
        </div>

        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'Employees' ? 'active' : ''}`}
            onClick={() => setActiveTab('Employees')}
          >
            Employee Management
          </button>
          <button 
            className={`admin-tab ${activeTab === 'Tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('Tasks')}
          >
            Task Management
          </button>
        </div>

        {activeTab === 'Employees' && (
          <section className="employee-management-section tab-section">
            <div className="section-header">
              <h2>Employee Management</h2>
              <button className="add-button" onClick={() => { resetEmployeeForm(); setShowAddForm(!showAddForm); }}>
                {showAddForm ? 'Cancel' : 'Add Employee'}
              </button>
            </div>

            {showAddForm && (
              <form className="employee-form" onSubmit={handleEmployeeSubmit}>
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleEmployeeChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleEmployeeChange} required />
                <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleEmployeeChange} required />
                <input type="text" name="department" placeholder="Department" value={formData.department} onChange={handleEmployeeChange} required />
                <input type="text" name="position" placeholder="Position" value={formData.position} onChange={handleEmployeeChange} required />
                <button type="submit" className="submit-btn">{editEmployeeId ? 'Update Employee' : 'Create Employee'}</button>
              </form>
            )}

            <div className="table-container">
              <table className="employee-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Department</th>
                    <th>Position</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id}>
                      <td>{emp.id}</td>
                      <td>{emp.name}</td>
                      <td>{emp.email}</td>
                      <td>{emp.phone}</td>
                      <td>{emp.department}</td>
                      <td>{emp.position}</td>
                      <td className="actions-cell">
                        <button className="edit-btn" onClick={() => handleEditEmployee(emp)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDeleteEmployee(emp.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {employees.length === 0 && (
                    <tr>
                      <td colSpan="7" className="empty-state">No employees found. Add one to get started!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'Tasks' && (
          <section className="task-management-section tab-section">
            <div className="section-header">
              <h2>Assign New Task</h2>
            </div>
            
            <form className="task-form" onSubmit={handleTaskSubmit}>
              <div className="form-row">
                <select name="assignedToId" value={taskFormData.assignedToId} onChange={handleTaskChange} required>
                  <option value="">-- Select Employee --</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
                  ))}
                </select>
                <input type="date" name="dueDate" value={taskFormData.dueDate} onChange={handleTaskChange} required />
                <select name="priority" value={taskFormData.priority} onChange={handleTaskChange} required>
                  <option value="LOW">Low Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="HIGH">High Priority</option>
                </select>
              </div>
              <input type="text" name="title" placeholder="Task Title" value={taskFormData.title} onChange={handleTaskChange} required />
              <textarea name="description" placeholder="Task Description" value={taskFormData.description} onChange={handleTaskChange} required rows="3"></textarea>
              <button type="submit" className="submit-btn">Assign Task</button>
            </form>

            <div className="section-header" style={{ marginTop: '40px' }}>
              <h2>Assigned Tasks</h2>
            </div>
            
            <div className="table-container">
              <table className="employee-table">
                <thead>
                  <tr>
                    <th>Task Title</th>
                    <th>Assigned To</th>
                    <th>Due Date</th>
                    <th>Priority</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td>
                        <strong>{task.title}</strong>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{task.description}</div>
                      </td>
                      <td>{task.assignedTo ? task.assignedTo.name : 'Unknown'}</td>
                      <td>{task.dueDate}</td>
                      <td>
                        <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td>{task.status}</td>
                    </tr>
                  ))}
                  {tasks.length === 0 && (
                    <tr>
                      <td colSpan="5" className="empty-state">No tasks have been assigned yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <div className="admin-dashboard-actions">
          <button onClick={handleLogout} className="logout-button" style={{ cursor: 'pointer', border: 'none', fontSize: '1rem' }}>Logout</button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
