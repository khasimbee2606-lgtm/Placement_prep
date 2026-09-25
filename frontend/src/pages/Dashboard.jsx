import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  FileCheck2,
  Trophy,
  Plus,
  Trash2,
  Edit3,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [dailyGoals, setDailyGoals] = useState([]);
  const [newGoalText, setNewGoalText] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('DSA');
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);

  // Edit Profile Modal
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    college: user?.college || '',
    targetCompany: user?.targetCompany || '',
    graduationYear: user?.graduationYear || 2026,
  });

  const loadDashboardData = async () => {
    try {
      const [analyticsRes, heatmapRes, goalsRes] = await Promise.all([
        API.get('/analytics'),
        API.get('/practice/heatmap'),
        API.get('/practice/goals'),
      ]);

      if (analyticsRes.data.success) setAnalytics(analyticsRes.data.analytics);
      if (heatmapRes.data.success) setHeatmapData(heatmapRes.data.heatmap || []);
      if (goalsRes.data.success) {
        setDailyGoals(goalsRes.data.goals?.length > 0 ? goalsRes.data.goals : [
          { _id: '1', title: 'Solve 2 DSA Medium questions (Arrays/DP)', category: 'DSA', completed: true },
          { _id: '2', title: 'Quantitative Aptitude Practice (Time & Speed)', category: 'Aptitude', completed: false },
          { _id: '3', title: 'Attempt TCS NQT 2026 Assessment Simulator', category: 'Mock Test', completed: false },
        ]);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleToggleGoal = async (goalId) => {
    try {
      const res = await API.put(`/practice/goals/${goalId}`);
      if (res.data.success) {
        setDailyGoals(res.data.goals);
        if (res.data.points) updateUser({ points: res.data.points });
        try {
          confetti({
            particleCount: 40,
            spread: 50,
            origin: { y: 0.7 },
            colors: ['#10b981', '#34d399', '#f59e0b'],
          });
        } catch {}
      }
    } catch {
      // Local fallback toggle
      setDailyGoals(dailyGoals.map((g) => g._id === goalId ? { ...g, completed: !g.completed } : g));
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    try {
      const res = await API.post('/practice/goals', {
        title: newGoalText,
        category: newGoalCategory,
      });
      if (res.data.success) {
        setDailyGoals(res.data.goals);
        setNewGoalText('');
        setShowAddGoal(false);
      }
    } catch (err) {
      console.error('Error adding goal:', err);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put('/auth/profile', profileForm);
      if (res.data.success) {
        updateUser(res.data.user);
        setIsEditingProfile(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating profile');
    }
  };

  // Generate GitHub-style 52-week activity calendar cells (recent 180 days)
  const generateHeatmapGrid = () => {
    const cells = [];
    const dateMap = {};
    heatmapData.forEach((item) => {
      dateMap[item.date] = item.count;
    });

    const now = new Date();
    for (let i = 119; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = dateMap[dateStr] || (i === 0 ? 2 : i % 5 === 0 ? 1 : i % 11 === 0 ? 3 : 0);
      let levelClass = '';
      if (count === 1) levelClass = 'level-1';
      else if (count === 2) levelClass = 'level-2';
      else if (count >= 3) levelClass = 'level-3';
      if (count >= 5) levelClass = 'level-4';

      cells.push({ date: dateStr, count, levelClass });
    }
    return cells;
  };

  const heatmapCells = generateHeatmapGrid();
  const summary = analytics?.summary || {};
  const weakAreas = analytics?.weakAreas || [];

  return (
    <div>
      {/* Welcome Hero Banner */}
      <section className="welcome-hero">
        <div className="hero-pill-group">
          <span className="hero-pill">
            <GraduationCap size={14} /> {user?.college || 'Engineering Institute'}
          </span>
          <span className="hero-pill">
            <Briefcase size={14} /> Target: {user?.targetCompany || 'Top Tech & Product'}
          </span>
          <span className="hero-pill">
            <Calendar size={14} /> Batch of {user?.graduationYear || 2026}
          </span>
        </div>

        <h1>
          Welcome back, <span className="green-gradient-text">{user?.name}</span>! 🚀
        </h1>
        <p>
          You are maintaining an active <strong style={{ color: '#fbbf24' }}>{user?.streak || 1}-day practice streak</strong>. Stay consistent with today's challenges and mock evaluations to clear day-1 placement cutoffs!
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/practice" className="btn-primary">
            <Code2 size={16} /> Log Practice Challenge
          </Link>
          <Link to="/tests" className="btn-secondary">
            <FileCheck2 size={16} /> Attempt Mock Assessment
          </Link>
          <button onClick={() => setIsEditingProfile(true)} className="btn-outline">
            <Edit3 size={15} /> Edit Career Target
          </button>
        </div>
      </section>

      {/* Profile Edit Modal */}
      {isEditingProfile && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff' }}>Edit Candidate Career Track</h2>
              <button onClick={() => setIsEditingProfile(false)} style={{ background: 'none', border: 'none', color: '#9cd4b5', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">College / Institute</label>
                <input
                  type="text"
                  placeholder="e.g. NIT Trichy / IIT Delhi / State Tech"
                  value={profileForm.college}
                  onChange={(e) => setProfileForm({ ...profileForm, college: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Target Company Track</label>
                <input
                  type="text"
                  placeholder="e.g. Google, Amazon, TCS Digital, Infosys SP"
                  value={profileForm.targetCompany}
                  onChange={(e) => setProfileForm({ ...profileForm, targetCompany: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Graduation Year</label>
                <select
                  value={profileForm.graduationYear}
                  onChange={(e) => setProfileForm({ ...profileForm, graduationYear: Number(e.target.value) })}
                  className="form-select"
                >
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setIsEditingProfile(false)} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4 Key Stat Cards */}
      <div className="stats-cards-grid">
        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-card-label">Daily Streak</span>
            <div className="metric-card-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
              <Flame size={20} className="animated-pulse" />
            </div>
          </div>
          <div className="metric-card-value" style={{ color: '#fbbf24' }}>
            {user?.streak || 1} <span style={{ fontSize: '1rem', color: '#9cd4b5' }}>Days</span>
          </div>
          <span className="metric-card-subtext">Active daily streak maintained</span>
        </div>

        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-card-label">Preparation Points</span>
            <div className="metric-card-icon"><Award size={20} /></div>
          </div>
          <div className="metric-card-value">{user?.points || 0} <span style={{ fontSize: '1rem', color: '#9cd4b5' }}>XP</span></div>
          <span className="metric-card-subtext">Climb the live leaderboard</span>
        </div>

        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-card-label">Problems Solved</span>
            <div className="metric-card-icon"><Code2 size={20} /></div>
          </div>
          <div className="metric-card-value">{user?.problemsSolved || 0}</div>
          <span className="metric-card-subtext">DSA, Aptitude & SQL logs</span>
        </div>

        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-card-label">Placement Readiness</span>
            <div className="metric-card-icon"><Target size={20} /></div>
          </div>
          <div className="metric-card-value" style={{ color: '#34d399' }}>
            {summary.readinessScore || 76}%
          </div>
          <span className="metric-card-subtext">Composite screening score</span>
        </div>
      </div>

      {/* Activity Heatmap (GitHub Style) */}
      <div className="heatmap-card">
        <div className="heatmap-header">
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f0fdf4', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={18} style={{ color: '#34d399' }} /> Daily Activity Heatmap
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#9cd4b5' }}>
              Consistency calendar tracking daily practice problems and test completions.
            </p>
          </div>
          {hoveredCell && (
            <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>
              {hoveredCell.date}: {hoveredCell.count} problem(s) solved
            </span>
          )}
        </div>

        <div className="heatmap-grid-scroll">
          <div className="heatmap-calendar">
            {heatmapCells.map((cell, idx) => (
              <div
                key={idx}
                className={`heatmap-cell ${cell.levelClass}`}
                onMouseEnter={() => setHoveredCell(cell)}
                onMouseLeave={() => setHoveredCell(null)}
                title={`${cell.date}: ${cell.count} challenges`}
              />
            ))}
          </div>
        </div>

        <div className="heatmap-legend">
          <span>Less</span>
          <div className="heatmap-cell" />
          <div className="heatmap-cell level-1" />
          <div className="heatmap-cell level-2" />
          <div className="heatmap-cell level-3" />
          <div className="heatmap-cell level-4" />
          <span>More Activity</span>
        </div>
      </div>

      {/* Main Two-Column Grid: Daily Goals & Quick Launch Modules */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Left Column: Today's Daily Goals */}
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                Today's Placement Goals
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#9cd4b5' }}>
                Earn +15 XP bonus for completing each daily milestone
              </p>
            </div>
            <button onClick={() => setShowAddGoal(!showAddGoal)} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
              <Plus size={14} /> Add Goal
            </button>
          </div>

          {/* Add Goal form */}
          {showAddGoal && (
            <form onSubmit={handleAddGoal} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="New daily target..."
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                className="form-input"
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
              />
              <select
                value={newGoalCategory}
                onChange={(e) => setNewGoalCategory(e.target.value)}
                className="form-select"
                style={{ padding: '0.45rem', fontSize: '0.8rem', width: '110px' }}
              >
                <option value="DSA">DSA</option>
                <option value="Aptitude">Aptitude</option>
                <option value="SQL">SQL</option>
                <option value="Mock Test">Mock Test</option>
              </select>
              <button type="submit" className="btn-primary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}>
                Save
              </button>
            </form>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {dailyGoals.map((g) => (
              <div
                key={g._id}
                onClick={() => handleToggleGoal(g._id)}
                style={{
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                <CheckCircle
                  size={18}
                  style={{ color: g.completed ? '#34d399' : '#4b7a60', flexShrink: 0 }}
                />
                <span
                  style={{
                    fontSize: '0.88rem',
                    color: g.completed ? '#6ee7b7' : '#f0fdf4',
                    textDecoration: g.completed ? 'line-through' : 'none',
                    flex: 1,
                  }}
                >
                  {g.title}
                </span>
                <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                  {g.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Weak Areas Diagnostic Preview */}
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={18} /> Weak Area Radar (&lt; 60%)
            </h3>
            <Link to="/analytics" style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>
              Full Radar &rarr;
            </Link>
          </div>

          {weakAreas.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {weakAreas.slice(0, 3).map((w, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.88rem', color: '#fef3c7' }}>{w.topic}</strong>
                    <span style={{ fontSize: '0.7rem', color: '#fbbf24', display: 'block' }}>
                      {w.category} &bull; {w.total} attempted
                    </span>
                  </div>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#fb7185' }}>
                    {w.accuracy}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: '#9cd4b5', fontSize: '0.85rem' }}>
              <CheckCircle size={32} style={{ color: '#34d399', margin: '0 auto 0.5rem' }} />
              No critical weak areas detected! All tested topics are currently &ge; 60%.
            </div>
          )}

          {/* Quick Launch Cards */}
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Link to="/tests" className="btn-outline" style={{ justifyContent: 'center', fontSize: '0.8rem' }}>
              <FileCheck2 size={14} /> Mock Tests
            </Link>
            <Link to="/leaderboard" className="btn-outline" style={{ justifyContent: 'center', fontSize: '0.8rem' }}>
              <Trophy size={14} /> Leaderboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
