import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  Flame,
  Award,
  Code2,
  Target,
  CheckCircle,
  Clock,
  AlertTriangle,
  Briefcase,
  GraduationCap,
  Sparkles,
  BookOpen,
  Calendar,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Layers,
  Edit3,
  Save,
  X
} from 'lucide-react';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    college: user?.college || '',
    targetCompany: user?.targetCompany || '',
    graduationYear: user?.graduationYear || 2026,
  });
  const [updateStatus, setUpdateStatus] = useState({ loading: false, msg: '' });

  // Sample quick stats / daily goals
  const dailyGoals = [
    { id: 1, title: 'Solve 2 DSA Medium questions', done: true, tag: 'DSA' },
    { id: 2, title: 'Complete Quantitative Aptitude quiz (Percentages)', done: false, tag: 'Aptitude' },
    { id: 3, title: 'Review SQL Joins & Subqueries', done: false, tag: 'SQL' },
  ];

  // Sample weak areas
  const weakAreas = [
    { topic: 'Dynamic Programming', accuracy: '42%', category: 'DSA', severity: 'High' },
    { topic: 'Time, Speed & Distance', accuracy: '55%', category: 'Aptitude', severity: 'Medium' },
    { topic: 'Graph Traversal (BFS/DFS)', accuracy: '58%', category: 'DSA', severity: 'Medium' },
  ];

  // Sample practice modules
  const practiceModules = [
    {
      title: 'Data Structures & Algorithms',
      desc: 'Arrays, Trees, Graphs, DP and Greedy techniques asked by top product firms.',
      solved: 34,
      total: 150,
      icon: Code2,
      color: 'card-cyan',
    },
    {
      title: 'TCS & Infosys Mock Test',
      desc: 'Full-length 30-min simulation with sectional timer and negative marking.',
      solved: 4,
      total: 10,
      icon: Target,
      color: 'card-indigo',
    },
    {
      title: 'Quantitative & Logical Aptitude',
      desc: 'Speed-math, probability, syllogisms, and data interpretation.',
      solved: 56,
      total: 120,
      icon: TrendingUp,
      color: 'card-amber',
    },
    {
      title: 'Core CS & SQL Database',
      desc: 'DBMS normalization, indexing, OS memory management & OOPs.',
      solved: 18,
      total: 60,
      icon: BookOpen,
      color: 'card-emerald',
    },
  ];

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdateStatus({ loading: true, msg: '' });
    try {
      const res = await API.put('/auth/profile', profileForm);
      if (res.data.success) {
        updateUser(res.data.user);
        setUpdateStatus({ loading: false, msg: 'Profile updated successfully!' });
        setTimeout(() => {
          setIsEditingProfile(false);
          setUpdateStatus({ loading: false, msg: '' });
        }, 1200);
      }
    } catch (err) {
      setUpdateStatus({
        loading: false,
        msg: err.response?.data?.message || 'Error updating profile',
      });
    }
  };

  return (
    <div className="dashboard-container">
      {/* Top Candidate Welcome Banner */}
      <section className="welcome-banner">
        <div className="welcome-content">
          <div className="welcome-tags">
            <span className="badge-tag college-tag">
              <GraduationCap size={14} className="tag-icon" />
              {user?.college || 'Engineering Institute'}
            </span>
            <span className="badge-tag target-tag">
              <Briefcase size={14} className="tag-icon" />
              Target: {user?.targetCompany || 'Top Tech'}
            </span>
            <span className="badge-tag year-tag">
              <Calendar size={14} className="tag-icon" />
              Graduating {user?.graduationYear || 2026}
            </span>
          </div>

          <h1 className="welcome-title">
            Welcome back, <span className="highlight-text">{user?.name}</span>! 🚀
          </h1>
          <p className="welcome-subtitle">
            You're currently on an active <strong className="text-streak">{user?.streak || 1}-day preparation streak</strong>. Keep solving today's challenges to stay ahead of upcoming campus recruitment drives!
          </p>

          <div className="banner-actions">
            <button
              onClick={() => setIsEditingProfile(true)}
              className="btn-secondary-pill"
            >
              <Edit3 size={15} />
              Edit Target Track & Profile
            </button>
          </div>
        </div>

        {/* Readiness Meter Card */}
        <div className="readiness-card">
          <div className="readiness-header">
            <span className="readiness-label">Placement Readiness</span>
            <span className="readiness-score">76%</span>
          </div>
          <div className="readiness-progress-bg">
            <div className="readiness-progress-fill" style={{ width: '76%' }}></div>
          </div>
          <p className="readiness-status">
            <Sparkles size={14} className="inline-sparkle" /> Status: <strong>Strong Candidate</strong>
          </p>
          <div className="readiness-detail">
            <span>Points XP: <strong>{user?.points || 0}</strong></span>
            <span>&bull;</span>
            <span>Account: <strong>Verified</strong></span>
          </div>
        </div>
      </section>

      {/* Profile Edit Modal */}
      {isEditingProfile && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Update Candidate Profile</h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="modal-close-btn"
              >
                <X size={20} />
              </button>
            </div>

            {updateStatus.msg && (
              <div className="alert-banner alert-success mb-4">
                <span>{updateStatus.msg}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">College / University</label>
                <input
                  type="text"
                  name="college"
                  value={profileForm.college}
                  onChange={handleProfileChange}
                  className="form-input"
                  placeholder="e.g. State Institute of Technology"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Company Track</label>
                <input
                  type="text"
                  name="targetCompany"
                  value={profileForm.targetCompany}
                  onChange={handleProfileChange}
                  className="form-input"
                  placeholder="e.g. Google, TCS Digital, Infosys SP"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Graduation Year</label>
                <select
                  name="graduationYear"
                  value={profileForm.graduationYear}
                  onChange={handleProfileChange}
                  className="form-input form-select"
                >
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="btn-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateStatus.loading}
                  className="btn-primary-small"
                >
                  {updateStatus.loading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Key Metric Stat Cards */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Daily Streak</span>
            <div className="stat-icon-wrapper flame-bg">
              <Flame size={20} className="flame-icon animated-bounce" />
            </div>
          </div>
          <div className="stat-card-number">
            {user?.streak || 1} <span className="stat-unit">Days</span>
          </div>
          <p className="stat-card-subtext">Active streak logic running on login</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Preparation XP</span>
            <div className="stat-icon-wrapper points-bg">
              <Award size={20} className="points-icon" />
            </div>
          </div>
          <div className="stat-card-number">
            {user?.points || 0} <span className="stat-unit">XP</span>
          </div>
          <p className="stat-card-subtext">+50 Welcome Bonus awarded</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Problems Solved</span>
            <div className="stat-icon-wrapper code-bg">
              <Code2 size={20} className="code-icon" />
            </div>
          </div>
          <div className="stat-card-number">
            {user?.problemsSolved || 0} <span className="stat-unit">Problems</span>
          </div>
          <p className="stat-card-subtext">Ready for practice submissions</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Mock Test Average</span>
            <div className="stat-icon-wrapper target-bg">
              <Target size={20} className="target-icon" />
            </div>
          </div>
          <div className="stat-card-number">
            82.5<span className="stat-unit">%</span>
          </div>
          <p className="stat-card-subtext">Passing threshold: 60%</p>
        </div>
      </section>

      {/* Main Content Grid: Modules & Goals */}
      <div className="dashboard-main-grid">
        {/* Left Column: Practice Tracks */}
        <div className="grid-left-column">
          <div className="section-title-bar">
            <div>
              <h2 className="section-title">Preparation Modules</h2>
              <p className="section-subtitle">Structured syllabus tailored for campus placement tests</p>
            </div>
          </div>

          <div className="modules-grid">
            {practiceModules.map((mod, index) => {
              const Icon = mod.icon;
              const percent = Math.round((mod.solved / mod.total) * 100);
              return (
                <div key={index} className={`module-card ${mod.color}`}>
                  <div className="module-card-header">
                    <div className="module-icon-box">
                      <Icon size={22} />
                    </div>
                    <span className="module-count">{mod.solved}/{mod.total} Completed</span>
                  </div>
                  <h3 className="module-name">{mod.title}</h3>
                  <p className="module-desc">{mod.desc}</p>
                  
                  <div className="module-progress">
                    <div className="progress-bar-rail">
                      <div className="progress-bar-fill" style={{ width: `${percent}%` }}></div>
                    </div>
                    <div className="progress-labels">
                      <span>Progress</span>
                      <span>{percent}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Weak Areas Diagnostic Warning Box */}
          <div className="diagnostic-card">
            <div className="diagnostic-header">
              <div className="diagnostic-title-group">
                <AlertTriangle size={20} className="warning-icon" />
                <h3>Weak Area Diagnostic Engine</h3>
              </div>
              <span className="badge-warning">Attention Needed</span>
            </div>
            <p className="diagnostic-text">
              Our placement analytics engine automatically identifies topics with test accuracy lower than 60% to help you clear cut-off marks:
            </p>
            
            <div className="weak-topic-list">
              {weakAreas.map((item, idx) => (
                <div key={idx} className="weak-topic-row">
                  <div className="topic-info">
                    <span className="topic-name">{item.topic}</span>
                    <span className="topic-category">{item.category}</span>
                  </div>
                  <div className="topic-accuracy">
                    <span className="accuracy-val">{item.accuracy} accuracy</span>
                    <span className="severity-badge">{item.severity} Priority</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Daily Goals & Quick Actions */}
        <div className="grid-right-column">
          {/* Daily Goals Widget */}
          <div className="widget-card">
            <div className="widget-header">
              <h3 className="widget-title">Today's Placement Goals</h3>
              <span className="goals-counter">1/3 Done</span>
            </div>
            <div className="goals-list">
              {dailyGoals.map((goal) => (
                <div key={goal.id} className={`goal-item ${goal.done ? 'goal-done' : ''}`}>
                  <div className="goal-check">
                    <CheckCircle size={18} className={goal.done ? 'check-active' : 'check-inactive'} />
                  </div>
                  <div className="goal-text">
                    <span className="goal-title">{goal.title}</span>
                    <span className="goal-badge">{goal.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Database & System Status Card */}
          <div className="widget-card system-info-card">
            <h3 className="widget-title">Database & Backend Status</h3>
            <div className="status-rows">
              <div className="status-row">
                <span className="status-label">Database</span>
                <span className="status-pill status-online">MongoDB Atlas Connected</span>
              </div>
              <div className="status-row">
                <span className="status-label">Authentication</span>
                <span className="status-pill status-online">JWT (Bcrypt 10 Rounds)</span>
              </div>
              <div className="status-row">
                <span className="status-label">Realtime Server</span>
                <span className="status-pill status-online">Socket.io Ready</span>
              </div>
              <div className="status-row">
                <span className="status-label">User Session</span>
                <span className="status-pill status-info">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
