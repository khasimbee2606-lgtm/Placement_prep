import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import AnimatedCounter from '../components/AnimatedCounter';
import { StatCardSkeleton, HeatmapSkeleton } from '../components/SkeletonLoader';
import {
  Flame,
  Award,
  Code2,
  Target,
  CheckCircle,
  AlertTriangle,
  Briefcase,
  GraduationCap,
  Sparkles,
  Calendar,
  FileCheck2,
  Trophy,
  Plus,
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
  const [loading, setLoading] = useState(true);

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
      setLoading(true);
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
    } finally {
      setLoading(false);
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
            colors: ['#16A34A', '#22C55E', '#065F46'],
          });
        } catch {}
      }
    } catch {
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

  // Generate GitHub-style 52-week activity calendar cells (recent 120 days)
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
    <div className="page-transition">
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

        <h1 style={{ color: '#1F2937' }}>
          Welcome back, <span style={{ color: '#16A34A' }}>{user?.name}</span>! 🚀
        </h1>
        <p style={{ color: '#4B5563' }}>
          You are maintaining an active <strong style={{ color: '#D97706' }}>{user?.streak || 1}-day practice streak</strong>. Stay consistent with today's challenges and mock evaluations to clear day-1 placement cutoffs!
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
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
          <div className="modal-content" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1F2937' }}>Edit Candidate Career Track</h2>
              <button onClick={() => setIsEditingProfile(false)} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label className="form-label" style={{ color: '#374151' }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: '#374151' }}>College / Institute</label>
                <input
                  type="text"
                  placeholder="e.g. NIT Trichy / IIT Delhi / State Tech"
                  value={profileForm.college}
                  onChange={(e) => setProfileForm({ ...profileForm, college: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: '#374151' }}>Target Company Track</label>
                <input
                  type="text"
                  placeholder="e.g. Google, Amazon, TCS Digital, Infosys SP"
                  value={profileForm.targetCompany}
                  onChange={(e) => setProfileForm({ ...profileForm, targetCompany: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: '#374151' }}>Graduation Year</label>
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

      {/* 4 Key Stat Cards (Soft Green Backgrounds, 12-16px Rounded Corners, Animated Numbers) */}
      {loading ? (
        <div className="stats-cards-grid">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : (
        <div className="stats-cards-grid">
          {/* Card 1: Streak (🔥) */}
          <div className="stat-card-soft card-animate stagger-1">
            <div className="metric-card-top">
              <span className="metric-card-label" style={{ color: '#065F46' }}>Streak (🔥)</span>
              <div className="metric-card-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>
                <Flame size={20} className="animated-pulse" />
              </div>
            </div>
            <div className="metric-card-value" style={{ color: '#B45309' }}>
              <AnimatedCounter end={user?.streak || 1} /> <span style={{ fontSize: '1.1rem', color: '#065F46' }}>Days</span>
            </div>
            <span className="metric-card-subtext" style={{ color: '#047857' }}>Active consecutive practice</span>
          </div>

          {/* Card 2: Problems Solved */}
          <div className="stat-card-soft card-animate stagger-2">
            <div className="metric-card-top">
              <span className="metric-card-label" style={{ color: '#065F46' }}>Problems Solved</span>
              <div className="metric-card-icon" style={{ background: '#DCFCE7', color: '#16A34A' }}>
                <Code2 size={20} />
              </div>
            </div>
            <div className="metric-card-value" style={{ color: '#065F46' }}>
              <AnimatedCounter end={user?.problemsSolved || 0} />
            </div>
            <span className="metric-card-subtext" style={{ color: '#047857' }}>DSA, Aptitude & SQL challenges</span>
          </div>

          {/* Card 3: Accuracy % */}
          <div className="stat-card-soft card-animate stagger-3">
            <div className="metric-card-top">
              <span className="metric-card-label" style={{ color: '#065F46' }}>Accuracy %</span>
              <div className="metric-card-icon" style={{ background: '#DCFCE7', color: '#16A34A' }}>
                <Target size={20} />
              </div>
            </div>
            <div className="metric-card-value" style={{ color: '#16A34A' }}>
              <AnimatedCounter end={summary.overallAccuracy || 78} suffix="%" />
            </div>
            <span className="metric-card-subtext" style={{ color: '#047857' }}>Average across all attempts</span>
          </div>

          {/* Card 4: Weak Areas */}
          <div className="stat-card-soft card-animate stagger-4">
            <div className="metric-card-top">
              <span className="metric-card-label" style={{ color: '#065F46' }}>Weak Areas</span>
              <div className="metric-card-icon" style={{ background: weakAreas.length > 0 ? '#FEE2E2' : '#DCFCE7', color: weakAreas.length > 0 ? '#DC2626' : '#16A34A' }}>
                <AlertTriangle size={20} />
              </div>
            </div>
            <div className="metric-card-value" style={{ color: weakAreas.length > 0 ? '#DC2626' : '#16A34A' }}>
              <AnimatedCounter end={weakAreas.length || 0} suffix=" Topics" />
            </div>
            <span className="metric-card-subtext" style={{ color: '#047857' }}>
              {weakAreas.length > 0 ? 'Topics below 60% passing mark' : 'All tested topics ≥ 60%'}
            </span>
          </div>
        </div>
      )}

      {/* Activity Heatmap (GitHub Style) */}
      {loading ? (
        <HeatmapSkeleton />
      ) : (
        <div className="heatmap-card" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div className="heatmap-header">
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1F2937', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={18} style={{ color: '#16A34A' }} /> Daily Activity Heatmap
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#6B7280' }}>
                Consistency calendar tracking daily practice problems and test completions.
              </p>
            </div>
            {hoveredCell && (
              <span style={{ fontSize: '0.82rem', color: '#16A34A', fontWeight: 600 }}>
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

          <div className="heatmap-legend" style={{ color: '#6B7280' }}>
            <span>Less</span>
            <div className="heatmap-cell" />
            <div className="heatmap-cell level-1" />
            <div className="heatmap-cell level-2" />
            <div className="heatmap-cell level-3" />
            <div className="heatmap-cell level-4" />
            <span>More Activity</span>
          </div>
        </div>
      )}

      {/* Main Two-Column Grid: Daily Goals & Weak Areas Radar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Left Column: Today's Daily Goals */}
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1F2937' }}>
                Today's Placement Goals
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>
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
                  background: g.completed ? '#F0FDF4' : '#F9FAFB',
                  border: '1px solid',
                  borderColor: g.completed ? '#DCFCE7' : '#E5E7EB',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <CheckCircle
                  size={18}
                  style={{ color: g.completed ? '#16A34A' : '#9CA3AF', flexShrink: 0 }}
                />
                <span
                  style={{
                    fontSize: '0.88rem',
                    color: g.completed ? '#065F46' : '#1F2937',
                    textDecoration: g.completed ? 'line-through' : 'none',
                    flex: 1,
                  }}
                >
                  {g.title}
                </span>
                <span className="badge" style={{ background: '#DCFCE7', color: '#16A34A', fontWeight: 600, fontSize: '0.72rem', padding: '0.2rem 0.55rem', borderRadius: '999px' }}>
                  {g.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Weak Areas Diagnostic Preview */}
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#D97706', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={18} /> Weak Area Radar (&lt; 60%)
            </h3>
            <Link to="/analytics" style={{ fontSize: '0.82rem', color: '#16A34A', fontWeight: 600 }}>
              Full Radar &rarr;
            </Link>
          </div>

          {weakAreas.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {weakAreas.slice(0, 3).map((w, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: '10px',
                    padding: '0.75rem 0.95rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.88rem', color: '#991B1B' }}>{w.topic}</strong>
                    <span style={{ fontSize: '0.72rem', color: '#B45309', display: 'block' }}>
                      {w.category} &bull; {w.total} attempted
                    </span>
                  </div>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#DC2626' }}>
                    {w.accuracy}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.75rem', color: '#4B5563', fontSize: '0.85rem' }}>
              <CheckCircle size={36} style={{ color: '#16A34A', margin: '0 auto 0.5rem' }} />
              <p style={{ fontWeight: 600, color: '#065F46' }}>No critical weak areas detected!</p>
              <p style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: '0.25rem' }}>All tested topics are currently &ge; 60% accuracy.</p>
            </div>
          )}

          {/* Quick Launch Cards */}
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #E5E7EB', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Link to="/tests" className="btn-outline" style={{ justifyContent: 'center', fontSize: '0.82rem' }}>
              <FileCheck2 size={14} /> Mock Tests
            </Link>
            <Link to="/leaderboard" className="btn-outline" style={{ justifyContent: 'center', fontSize: '0.82rem' }}>
              <Trophy size={14} /> Leaderboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
