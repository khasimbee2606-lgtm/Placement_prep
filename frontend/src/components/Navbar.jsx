import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Flame, 
  Award, 
  LogOut, 
  User, 
  Layers, 
  Sparkles, 
  Briefcase 
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="navbar-logo">
          <div className="logo-icon-wrapper">
            <Layers className="logo-icon" size={24} />
          </div>
          <div className="logo-text-block">
            <span className="logo-title">PlacementPrep</span>
            <span className="logo-badge">Pro</span>
          </div>
        </Link>

        {/* Right Section */}
        <div className="navbar-actions">
          {isAuthenticated && user ? (
            <>
              {/* Gamification stats pill */}
              <div className="stats-pill-group">
                <div className="stat-pill streak-pill" title="Daily Activity Streak">
                  <Flame size={18} className="flame-icon animated-bounce" />
                  <span className="pill-value">{user.streak || 1}</span>
                  <span className="pill-label">Days Streak</span>
                </div>

                <div className="stat-pill points-pill" title="Preparation Points Earned">
                  <Award size={18} className="points-icon" />
                  <span className="pill-value">{user.points || 0}</span>
                  <span className="pill-label">XP</span>
                </div>
              </div>

              {/* User Profile Info */}
              <div className="user-profile-menu">
                <div className="avatar-circle">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="user-details-mini">
                  <span className="user-name">{user.name}</span>
                  <span className="user-target" title="Target Company">
                    <Briefcase size={12} className="inline-icon" />
                    {user.targetCompany || 'Top Tech'}
                  </span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="btn-logout"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                  <span className="btn-logout-text">Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="btn-text">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary-small">
                <Sparkles size={16} />
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
