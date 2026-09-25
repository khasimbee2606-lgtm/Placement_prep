import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Code2,
  FileCheck2,
  BarChart3,
  Trophy,
  Flame,
  LogOut,
  Sparkles,
  Layers,
  GraduationCap,
  User
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
    { to: '/practice', label: 'Practice Tracker', icon: Code2, badge: 'Active' },
    { to: '/tests', label: 'Mock Test Simulator', icon: FileCheck2, badge: 'TCS / Infy' },
    { to: '/analytics', label: 'Analytics & Weak Areas', icon: BarChart3 },
    { to: '/leaderboard', label: 'Live Leaderboard', icon: Trophy, badge: 'Live' },
    { to: '/profile', label: 'Candidate Profile', icon: User },
  ];

  return (
    <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand Header */}
      <NavLink to="/landing" className="sidebar-brand" style={{ textDecoration: 'none' }}>
        <div className="brand-icon-box">
          <GraduationCap size={22} />
        </div>
        <div>
          <span className="brand-title">Campus2Career</span>
          <span className="brand-subtitle">Placement Preparation Platform</span>
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
              {item.badge && <span className="nav-badge">{item.badge}</span>}
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
          <div className="sidebar-user-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user?.name || 'Candidate'}</span>
            <span className="sidebar-user-role">
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
