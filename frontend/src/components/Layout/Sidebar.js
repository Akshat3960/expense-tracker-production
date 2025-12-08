import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Layout.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>💰 Expense Tracker</h2>
        <p className="user-name">Welcome, {user?.name}</p>
      </div>
      
      <nav className="sidebar-nav">
        <Link 
          to="/dashboard" 
          className={location.pathname === '/dashboard' ? 'nav-link active' : 'nav-link'}
        >
          <span className="nav-icon">📊</span>
          Dashboard
        </Link>
        <Link 
          to="/income" 
          className={location.pathname === '/income' ? 'nav-link active' : 'nav-link'}
        >
          <span className="nav-icon">💵</span>
          Income
        </Link>
        <Link 
          to="/expense" 
          className={location.pathname === '/expense' ? 'nav-link active' : 'nav-link'}
        >
          <span className="nav-icon">💸</span>
          Expenses
        </Link>
        <Link 
          to="/bill-scanner" 
          className={location.pathname === '/bill-scanner' ? 'nav-link active' : 'nav-link'}
        >
          <span className="nav-icon">📸</span>
          Scan Bill
        </Link>
        <button onClick={handleLogout} className="nav-link logout-btn">
          <span className="nav-icon">🚪</span>
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;