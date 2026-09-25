import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  Menu,
  Flame,
  Award,
  Bell,
  X,
  AlertTriangle,
  Target,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const Topbar = ({ toggleMobileSidebar }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get('/practice/notifications');
        if (res.data.success) {
          setNotifications(res.data.notifications || []);
          setUnreadCount(res.data.notifications.length);
        }
      } catch (err) {
        // Fallback notifications if route loading
        setNotifications([
          {
            _id: 'default-streak',
            title: '🔥 Daily Streak Active',
            message: `You're on a ${user?.streak || 1}-day streak! Keep going today.`,
            type: 'streak',
          },
        ]);
        setUnreadCount(1);
      }
    };

    fetchNotifications();
  }, [user?.streak]);

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
        <span style={{ fontSize: '0.85rem', color: '#6ee7b7', fontWeight: 500 }}>
          🎯 Day-1 Placement Preparation Mode
        </span>
      </div>

      <div className="topbar-actions">
        {/* Streak Chip */}
        <div className="stat-chip streak-chip" title="Continuous Practice Streak">
          <Flame size={16} className="flame-icon animated-pulse" />
          <span>{user?.streak || 1} Days</span>
        </div>

        {/* XP Points Chip */}
        <div className="stat-chip" title="Preparation Points (XP)">
          <Award size={16} style={{ color: '#10b981' }} />
          <span>{user?.points || 0} XP</span>
        </div>

        {/* Notifications Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn-outline"
            style={{ padding: '0.45rem', borderRadius: '50%', position: 'relative' }}
            title="Notifications & Streak Alerts"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#10b981',
                  color: 'white',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: '48px',
                right: '0',
                width: '320px',
                background: '#0c1611',
                border: '1px solid rgba(52, 211, 153, 0.25)',
                borderRadius: '12px',
                padding: '1rem',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.7)',
                zIndex: 100,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingBottom: '0.5rem',
                  marginBottom: '0.75rem',
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f0fdf4' }}>
                  Alerts & Streak Warnings
                </span>
                <button
                  onClick={() => setShowNotifications(false)}
                  style={{ background: 'none', border: 'none', color: '#6ee7b7', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {notifications.map((notif, idx) => (
                  <div
                    key={notif._id || idx}
                    style={{
                      background: 'rgba(16, 185, 129, 0.07)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      borderRadius: '8px',
                      padding: '0.65rem 0.8rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.2rem',
                    }}
                  >
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#34d399' }}>
                      {notif.title}
                    </span>
                    <p style={{ fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                      {notif.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
