import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Code2,
  FileCheck2,
  BarChart3,
  Trophy,
  User,
  LogOut
} from 'lucide-react';

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/practice', label: 'Practice Tracker', icon: Code2 },
    { to: '/tests', label: 'Mock Tests', icon: FileCheck2 },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand Header with Uploaded Logo */}
      <NavLink to="/dashboard" className="sidebar-brand" style={{ textDecoration: 'none' }} title="Campus2Career">
        <div className="sidebar-logo-container">
          <img src="/logo.png" alt="Campus2Career" className="sidebar-logo-img" />
        </div>
        <div>
          <span className="brand-title">Campus<span style={{ color: '#16a34a' }}>2</span>Career</span>
          <span className="brand-subtitle">Track &bull; Analyze &bull; Achieve</span>
        </div>
      </NavLink>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen && setMobileOpen(false)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer with Logout */}
      <div className="sidebar-footer">
        <div
          className="sidebar-user"
          onClick={() => navigate('/profile')}
          style={{ cursor: 'pointer' }}
          title="View & Edit Profile"
        >
          <div className="sidebar-user-avatar" style={{ background: 'linear-gradient(135deg, #16a34a 0%, #065f46 100%)' }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user?.name || 'Candidate'}</span>
            <span className="sidebar-user-role" style={{ color: '#16a34a' }}>
              {user?.targetCompany ? user.targetCompany.split(' ')[0] : 'Top Tech'} Track
            </span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); handleLogout(); }}
            className="btn-danger ml-auto"
            title="Sign Out"
            style={{ marginLeft: 'auto', padding: '0.4rem 0.6rem' }}
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
