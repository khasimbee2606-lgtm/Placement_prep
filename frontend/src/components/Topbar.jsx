import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  Menu,
  Flame,
  Award,
  Bell,
  X,
  Search,
  User,
  ExternalLink
} from 'lucide-react';

const Topbar = ({ toggleMobileSidebar }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get('/practice/notifications');
        if (res.data.success) {
          setNotifications(res.data.notifications || []);
          setUnreadCount(res.data.notifications.length);
        }
      } catch (err) {
        setNotifications([
          {
            _id: 'default-streak',
            title: '🔥 Daily Streak Active',
            message: `You're on a ${user?.streak || 1}-day streak! Solve a problem today to keep it burning.`,
            type: 'streak',
          },
          {
            _id: 'default-test',
            title: '🎯 Placement Mock Simulator',
            message: 'TCS NQT and Infosys SP mock test patterns are live for your batch.',
            type: 'test',
          }
        ]);
        setUnreadCount(2);
      }
    };

    fetchNotifications();
  }, [user?.streak]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/practice?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const candidateInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'C';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          onClick={toggleMobileSidebar}
          className="mobile-toggle-btn"
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={22} />
        </button>

        {/* Logo on Left */}
        <Link to="/dashboard" className="topbar-brand" title="Campus2Career Home">
          <img src="/logo.png" alt="Campus2Career Logo" className="topbar-logo-img" />
          <span className="topbar-brand-name">
            Campus<span>2</span>Career
          </span>
        </Link>

        {/* LinkedIn-Style Search Bar */}
        <form onSubmit={handleSearchSubmit} className="topbar-search">
          <Search size={16} className="topbar-search-icon" />
          <input
            type="text"
            placeholder="Search problems, topics, mock tests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="topbar-search-input"
          />
        </form>
      </div>

      <div className="topbar-actions">
        {/* Streak Chip */}
        <div className="stat-chip streak-chip" title="Continuous Practice Streak">
          <Flame size={16} className="flame-icon animated-pulse" />
          <span>{user?.streak || 1} Days</span>
        </div>

        {/* XP Points Chip */}
        <div className="stat-chip" title="Preparation Points (XP)">
          <Award size={16} style={{ color: '#16a34a' }} />
          <span>{user?.points || 0} XP</span>
        </div>

        {/* Notifications Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn-outline"
            style={{ padding: '0.45rem', borderRadius: '50%', position: 'relative' }}
            title="Notifications & Streak Alerts"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#16a34a',
                  color: 'white',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 8px rgba(22, 163, 74, 0.5)',
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Clean White Notification Dropdown Drawer with subtle shadow */}
          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: '48px',
                right: '0',
                width: '320px',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '1rem',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                zIndex: 100,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid #f3f4f6',
                  paddingBottom: '0.5rem',
                  marginBottom: '0.75rem',
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1f2937' }}>
                  Notifications & Alerts
                </span>
                <button
                  onClick={() => setShowNotifications(false)}
                  style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {notifications.map((notif, idx) => (
                  <div
                    key={notif._id || idx}
                    style={{
                      background: '#f0fdf4',
                      border: '1px solid #dcfce7',
                      borderRadius: '8px',
                      padding: '0.65rem 0.8rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.2rem',
                    }}
                  >
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#16a34a' }}>
                      {notif.title}
                    </span>
                    <p style={{ fontSize: '0.75rem', color: '#4b5563', lineHeight: 1.4 }}>
                      {notif.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Profile Avatar with Name */}
        <Link
          to="/profile"
          className="topbar-avatar-btn"
          title="View Candidate Profile"
        >
          <div className="topbar-avatar-circle">
            {candidateInitial}
          </div>
          <span className="topbar-user-name">
            {user?.name ? user.name.split(' ')[0] : 'Candidate'}
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Topbar;
