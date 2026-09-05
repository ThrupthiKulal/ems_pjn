import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import './UserDashboard.css';

function UserDashboard() {
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [myTasks, setMyTasks] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees", error);
    }
  };

  const sidebarItems = [
    'Dashboard',
    'My Profile',
    'Employees',
    'My Tasks',
    'Notifications',
    'Logout',
  ];

  const statCards = [
    { title: 'My Profile', value: 'Completed', accent: 'blue' },
    { title: 'Department', value: 'IT', accent: 'green' },
    { title: 'Employee Status', value: 'Active', accent: 'purple' },
  ];

  const navigate = useNavigate();

  const loggedInName = localStorage.getItem('loggedInUser') || 'User';
  
  // Find the matching employee to populate real profile details, or provide fallbacks
  const userProfile = employees.find(emp => emp.name.toLowerCase() === loggedInName.toLowerCase()) || {
    name: loggedInName,
    email: 'No email found',
    phone: 'No phone found',
    department: 'Unassigned',
    position: 'Employee',
    id: null
  };

  useEffect(() => {
    if (userProfile.id) {
      fetchMyTasks(userProfile.id);
    }
  }, [userProfile.id]);

  const fetchMyTasks = async (employeeId) => {
    try {
      const response = await api.get(`/tasks/employee/${employeeId}`);
      setMyTasks(response.data);
    } catch (error) {
      console.error("Error fetching my tasks", error);
    }
  };

  const handleSidebarClick = (item) => {
    if (item === 'Logout') {
      if (window.confirm("Do you want to log out?")) {
        navigate('/login');
      }
    } else {
      setActiveTab(item);
    }
  };

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">E</span>
          <span>EMS</span>
        </div>

        <nav className="nav-menu">
          {sidebarItems.map((item) => (
            <button
              key={item}
              onClick={() => handleSidebarClick(item)}
              className={`nav-item ${activeTab === item ? 'active' : ''}`}
              type="button"
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="topbar-label">Employee Management System</p>
          </div>
          <div className="user-badge">{userProfile.name}</div>
        </header>

        {activeTab === 'Dashboard' && (
          <>
            <section className="welcome-box">
              <h1>Welcome, {userProfile.name}</h1>
              <p>Here is your overview for today.</p>
            </section>

            <section className="stats-grid">
              {statCards.map((card) => (
                <div key={card.title} className={`stat-card ${card.accent}`}>
                  <p>{card.title}</p>
                  <h3>{card.value}</h3>
                </div>
              ))}
            </section>
            
            <section className="employee-list-section">
              <h2>Company Directory</h2>
              <div className="employee-list-container">
                {employees.length === 0 ? (
                  <p className="no-data">No employees available to display.</p>
                ) : (
                  <div className="employee-grid">
                    {employees.map(emp => (
                      <div key={emp.id} className="employee-card">
                        <div className="employee-avatar">{emp.name.charAt(0)}</div>
                        <div className="employee-info">
                          <h4>{emp.name}</h4>
                          <p>{emp.position}</p>
                          <span className="dept-badge">{emp.department}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {activeTab === 'My Profile' && (
          <section className="profile-section">
            <div className="profile-header-bg"></div>
            <div className="profile-card">
              <div className="profile-avatar-large">{userProfile.name.charAt(0).toUpperCase()}</div>
              <div className="profile-details">
                <h2>{userProfile.name}</h2>
                <p className="profile-role">{userProfile.position}</p>
                <div className="profile-info-grid">
                  <div className="info-group">
                    <label>Email</label>
                    <p>{userProfile.email}</p>
                  </div>
                  <div className="info-group">
                    <label>Phone</label>
                    <p>{userProfile.phone}</p>
                  </div>
                  <div className="info-group">
                    <label>Department</label>
                    <p>{userProfile.department}</p>
                  </div>
                  <div className="info-group">
                    <label>Role</label>
                    <p>{userProfile.position}</p>
                  </div>
                </div>
                <button className="edit-profile-btn">Edit Profile</button>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'Employees' && (
          <section className="employee-list-section" style={{ marginTop: '0' }}>
            <h2>Company Directory</h2>
            <div className="employee-list-container">
              {employees.length === 0 ? (
                <p className="no-data">No employees available to display.</p>
              ) : (
                <div className="employee-grid">
                  {employees.map(emp => (
                    <div key={emp.id} className="employee-card">
                      <div className="employee-avatar">{emp.name.charAt(0)}</div>
                      <div className="employee-info">
                        <h4>{emp.name}</h4>
                        <p>{emp.position}</p>
                        <span className="dept-badge">{emp.department}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'My Tasks' && (
          <section className="task-list-section">
            <div className="section-header">
              <h2>My Assigned Tasks</h2>
            </div>
            
            <div className="table-container">
              <table className="employee-table">
                <thead>
                  <tr>
                    <th>Task Title</th>
                    <th>Assigned Date</th>
                    <th>Due Date</th>
                    <th>Priority</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myTasks.map((task) => (
                    <tr key={task.id}>
                      <td>
                        <strong>{task.title}</strong>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{task.description}</div>
                      </td>
                      <td>{task.assignedDate}</td>
                      <td>{task.dueDate}</td>
                      <td>
                        <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td>{task.status}</td>
                    </tr>
                  ))}
                  {myTasks.length === 0 && (
                    <tr>
                      <td colSpan="5" className="empty-state">No tasks assigned.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'Notifications' && (
          <section className="welcome-box">
            <h2>Notifications</h2>
            <p>You have 0 new notifications.</p>
          </section>
        )}

      </main>
    </div>
  );
}

export default UserDashboard;
