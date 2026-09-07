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

  // Review State
  const [previewImage, setPreviewImage] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTaskId, setRejectTaskId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  // Task Details Modal State
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);
  const [showTaskDetailsModal, setShowTaskDetailsModal] = useState(false);

  // Employee Review Modal State
  const [reviewEmployee, setReviewEmployee] = useState(null);

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

  // --- Review Methods ---
  const openTaskDetailsModal = (task) => {
    setSelectedTaskDetails(task);
    setShowTaskDetailsModal(true);
  };

  const closeTaskDetailsModal = () => {
    setSelectedTaskDetails(null);
    setShowTaskDetailsModal(false);
  };

  const handleApprove = async (taskId) => {
    try {
      await api.post(`/tasks/${taskId}/review`, { reviewStatus: 'APPROVED' });
      alert("Task successfully approved!");
      fetchTasks();
      if (selectedTaskDetails && selectedTaskDetails.id === taskId) {
        setSelectedTaskDetails(prev => ({ ...prev, reviewStatus: 'APPROVED' }));
      }
    } catch (error) {
      console.error("Error approving task", error);
      alert("Failed to approve task.");
    }
  };

  const openRejectModal = (taskId) => {
    setRejectTaskId(taskId);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      alert("Please enter a rejection reason.");
      return;
    }
    try {
      await api.post(`/tasks/${rejectTaskId}/review`, { 
        reviewStatus: 'REJECTED', 
        rejectionReason: rejectReason 
      });
      alert("Task successfully rejected.");
      setShowRejectModal(false);
      setRejectTaskId(null);
      fetchTasks();
      if (selectedTaskDetails && selectedTaskDetails.id === rejectTaskId) {
        setSelectedTaskDetails(prev => ({ ...prev, reviewStatus: 'REJECTED', rejectionReason: rejectReason }));
      }
    } catch (error) {
      console.error("Error rejecting task", error);
      alert("Failed to reject task.");
    }
  };


  const handleLogout = () => {
    if (window.confirm("Do you want to log out?")) {
      navigate('/admin-login', { replace: true });
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
              <button className="add-button" onClick={() => { 
                if (showAddForm) {
                  resetEmployeeForm();
                } else {
                  setShowAddForm(true);
                }
              }}>
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
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="submit-btn">{editEmployeeId ? 'Update Employee' : 'Create Employee'}</button>
                  <button type="button" className="cancel-btn" onClick={resetEmployeeForm}>Cancel</button>
                </div>
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
                    <th>Action</th>
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
                      <td>
                        <button className="view-btn" onClick={() => openTaskDetailsModal(task)}>Review Task</button>
                      </td>
                    </tr>
                  ))}
                  {tasks.length === 0 && (
                    <tr>
                      <td colSpan="6" className="empty-state">No tasks have been assigned yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {previewImage && (
          <div className="modal-overlay" style={{ zIndex: 1200 }} onClick={() => setPreviewImage(null)}>
            <div className="modal-content image-preview-modal" onClick={e => e.stopPropagation()}>
              <span className="close-btn" onClick={() => setPreviewImage(null)}>&times;</span>
              <img src={previewImage} alt="Task Screenshot" className="full-preview-img" />
            </div>
          </div>
        )}

        {showRejectModal && (
          <div className="modal-overlay" style={{ zIndex: 1100 }}>
            <div className="modal-content reject-modal">
              <h3>Reject Submission</h3>
              <p>Please provide a reason for rejecting this task submission.</p>
              <textarea 
                value={rejectReason} 
                onChange={(e) => setRejectReason(e.target.value)} 
                placeholder="Rejection Reason"
                rows="4"
              ></textarea>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={(e) => { e.stopPropagation(); setShowRejectModal(false); }}>Cancel</button>
                <button type="button" className="submit-reject-btn" onClick={handleRejectSubmit}>Submit Rejection</button>
              </div>
            </div>
          </div>
        )}

        {showTaskDetailsModal && selectedTaskDetails && (
          <div className="modal-overlay" style={{ zIndex: 1050 }} onClick={closeTaskDetailsModal}>
            <div className="modal-content task-details-modal" onClick={e => e.stopPropagation()}>
              <span className="close-btn" onClick={closeTaskDetailsModal}>&times;</span>
              
              <div className="modal-header">
                <h2>{selectedTaskDetails.title}</h2>
                <div className="task-meta">
                  <span className={`priority-badge ${selectedTaskDetails.priority.toLowerCase()}`}>{selectedTaskDetails.priority}</span>
                  <span className="status-badge" style={{ background: '#374151', color: '#d1d5db', marginLeft: '10px' }}>{selectedTaskDetails.status}</span>
                </div>
              </div>

              <div className="task-details-grid">
                <div className="detail-group">
                  <label>Assigned To</label>
                  <p>{selectedTaskDetails.assignedTo ? selectedTaskDetails.assignedTo.name : 'Unknown'}</p>
                </div>
                <div className="detail-group">
                  <label>Due Date</label>
                  <p>{selectedTaskDetails.dueDate}</p>
                </div>
              </div>

              <div className="detail-group full-width" style={{ marginTop: '16px' }}>
                <label>Description</label>
                <p className="description-text">{selectedTaskDetails.description}</p>
              </div>

              {selectedTaskDetails.screenshotBase64 ? (
                <div className="submission-section">
                  <h3 className="section-subtitle">Employee Submission</h3>
                  <div className="submission-meta">
                    <div className="detail-group">
                      <label>Submitted On</label>
                      <p>{selectedTaskDetails.submissionDate || 'N/A'}</p>
                    </div>
                    <div className="detail-group">
                      <label>Review Status</label>
                      <p>
                        {selectedTaskDetails.reviewStatus === 'PENDING' && <span className="status-badge pending">Pending</span>}
                        {selectedTaskDetails.reviewStatus === 'APPROVED' && <span className="status-badge approved">Approved</span>}
                        {selectedTaskDetails.reviewStatus === 'REJECTED' && <span className="status-badge rejected">Rejected</span>}
                        {!selectedTaskDetails.reviewStatus && <span className="status-badge pending">Pending</span>}
                      </p>
                    </div>
                  </div>
                  
                  {selectedTaskDetails.reviewStatus === 'REJECTED' && selectedTaskDetails.rejectionReason && (
                    <div className="rejection-alert">
                      <strong>Rejection Reason:</strong> {selectedTaskDetails.rejectionReason}
                    </div>
                  )}

                  <div className="screenshot-container-large">
                    <img src={selectedTaskDetails.screenshotBase64} alt="Submission Screenshot" className="submitted-screenshot" />
                  </div>

                  {(!selectedTaskDetails.reviewStatus || selectedTaskDetails.reviewStatus === 'PENDING') && (
                    <div className="modal-actions" style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                      <button type="button" className="cancel-btn" onClick={closeTaskDetailsModal}>Cancel</button>
                      <button type="button" className="reject-btn" onClick={() => openRejectModal(selectedTaskDetails.id)}>Reject</button>
                      <button type="button" className="approve-btn" onClick={() => handleApprove(selectedTaskDetails.id)}>Approve</button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="submission-section empty-submission">
                  <h3 className="section-subtitle">Employee Submission</h3>
                  <div style={{ padding: '20px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', color: '#94a3b8' }}>
                    <p>No screenshot or document has been submitted for this task yet.</p>
                  </div>
                  <div className="modal-actions" style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                    <button type="button" className="cancel-btn" onClick={closeTaskDetailsModal}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="admin-dashboard-actions">
          <button onClick={handleLogout} className="logout-button" style={{ cursor: 'pointer', border: 'none', fontSize: '1rem' }}>Logout</button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
