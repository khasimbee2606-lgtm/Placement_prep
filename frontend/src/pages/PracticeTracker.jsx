import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import AnimatedCounter from '../components/AnimatedCounter';
import { TableRowSkeleton } from '../components/SkeletonLoader';
import {
  Plus,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Code2,
  Sparkles,
  TrendingUp,
  Trash2,
  X,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';

const PracticeTracker = () => {
  const { updateUser } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [curatedProblems, setCuratedProblems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, msg: '', type: 'success' });

  // Filter and search states
  const [filters, setFilters] = useState({
    type: 'All',
    difficulty: 'All',
    search: '',
  });

  // New problem form
  const [newProblem, setNewProblem] = useState({
    title: '',
    type: 'DSA',
    topic: 'Arrays & Hashing',
    difficulty: 'Medium',
    timeTaken: 15,
    isCorrect: true,
    notes: '',
  });

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.type !== 'All') params.type = filters.type;
      if (filters.difficulty !== 'All') params.difficulty = filters.difficulty;
      if (filters.search) params.search = filters.search;

      const res = await API.get('/practice', { params });
      if (res.data.success) {
        setHistory(res.data.history || []);
      }
    } catch (err) {
      console.error('Error fetching practice history:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurated = async () => {
    try {
      const res = await API.get('/practice/curated');
      if (res.data.success) {
        setCuratedProblems(res.data.problems || []);
      }
    } catch (err) {
      console.error('Error fetching curated problems:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [filters.type, filters.difficulty]);

  useEffect(() => {
    fetchCurated();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHistory();
  };

  const handleAddProblem = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/practice', newProblem);
      if (res.data.success) {
        setNotification({
          show: true,
          msg: res.data.message || 'Problem logged successfully!',
          type: 'success',
        });
        updateUser(res.data.user);
        setShowAddModal(false);
        setNewProblem({
          title: '',
          type: 'DSA',
          topic: 'Arrays & Hashing',
          difficulty: 'Medium',
          timeTaken: 15,
          isCorrect: true,
          notes: '',
        });

        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#16A34A', '#22C55E', '#065F46', '#DCFCE7'],
          });
        } catch {}

        fetchHistory();
      }
    } catch (err) {
      setNotification({
        show: true,
        msg: err.response?.data?.message || 'Error logging problem',
        type: 'error',
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this problem from your practice history?')) return;
    try {
      const res = await API.delete(`/practice/${id}`);
      if (res.data.success) {
        updateUser(res.data.user);
        setHistory(history.filter((h) => h._id !== id));
      }
    } catch (err) {
      alert('Error deleting problem');
    }
  };

  const handlePickCurated = (cp) => {
    setNewProblem({
      title: cp.title,
      type: cp.type,
      topic: cp.topic,
      difficulty: cp.difficulty,
      timeTaken: cp.difficulty === 'Easy' ? 10 : cp.difficulty === 'Medium' ? 20 : 35,
      isCorrect: true,
      notes: `Company tags: ${cp.companies ? cp.companies.join(', ') : 'TCS, Infosys'}`,
    });
    setShowAddModal(true);
  };

  const totalCount = history.length;
  const correctCount = history.filter((h) => h.isCorrect).length;
  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const totalMinutes = history.reduce((acc, h) => acc + (h.timeTaken || 0), 0);

  return (
    <div className="page-transition">
      {/* Toast Notification */}
      {notification.show && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: notification.type === 'success' ? '#16A34A' : '#DC2626',
            color: 'white',
            padding: '0.85rem 1.4rem',
            borderRadius: '10px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          <span>{notification.msg}</span>
          <button
            onClick={() => setNotification({ show: false, msg: '', type: 'success' })}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginLeft: '0.5rem' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '1.75rem' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1F2937' }}>
            Placement <span style={{ color: '#16A34A' }}>Practice Tracker</span>
          </h1>
          <p className="page-subtitle" style={{ fontSize: '0.88rem', color: '#6B7280' }}>
            Record solved problems across DSA, Aptitude, and SQL to power diagnostic weak-area radar.
          </p>
        </div>

        {/* Add Problem Green CTA Button */}
        <div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
            style={{ padding: '0.75rem 1.4rem', fontSize: '0.92rem' }}
            id="log-problem-btn"
          >
            <Plus size={18} />
            <span>Add Solved Problem</span>
          </button>
        </div>
      </div>

      {/* Metrics Row (Soft Green & White) */}
      <div className="stats-cards-grid" style={{ marginBottom: '1.75rem' }}>
        <div className="stat-card-soft card-animate stagger-1">
          <div className="metric-card-top">
            <span className="metric-card-label" style={{ color: '#065F46' }}>Total Problems</span>
            <div className="metric-card-icon" style={{ background: '#DCFCE7', color: '#16A34A' }}>
              <Code2 size={20} />
            </div>
          </div>
          <div className="metric-card-value" style={{ color: '#065F46' }}>
            <AnimatedCounter end={totalCount} />
          </div>
          <span className="metric-card-subtext" style={{ color: '#047857' }}>Verified practice logs</span>
        </div>

        <div className="stat-card-soft card-animate stagger-2">
          <div className="metric-card-top">
            <span className="metric-card-label" style={{ color: '#065F46' }}>Accuracy Rate</span>
            <div className="metric-card-icon" style={{ background: '#DCFCE7', color: '#16A34A' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="metric-card-value" style={{ color: accuracy >= 60 ? '#16A34A' : '#DC2626' }}>
            <AnimatedCounter end={accuracy} suffix="%" />
          </div>
          <span className="metric-card-subtext" style={{ color: '#047857' }}>Passing cutoff: 60%</span>
        </div>

        <div className="stat-card-soft card-animate stagger-3">
          <div className="metric-card-top">
            <span className="metric-card-label" style={{ color: '#065F46' }}>Total Time Invested</span>
            <div className="metric-card-icon" style={{ background: '#DCFCE7', color: '#16A34A' }}>
              <Clock size={20} />
            </div>
          </div>
          <div className="metric-card-value" style={{ color: '#065F46' }}>
            <AnimatedCounter end={totalMinutes} /> <span style={{ fontSize: '1.1rem', color: '#047857' }}>mins</span>
          </div>
          <span className="metric-card-subtext" style={{ color: '#047857' }}>
            Avg {(totalCount > 0 ? (totalMinutes / totalCount).toFixed(1) : 0)} mins/problem
          </span>
        </div>

        <div className="stat-card-soft card-animate stagger-4">
          <div className="metric-card-top">
            <span className="metric-card-label" style={{ color: '#065F46' }}>Correct Submissions</span>
            <div className="metric-card-icon" style={{ background: '#DCFCE7', color: '#16A34A' }}>
              <CheckCircle size={20} />
            </div>
          </div>
          <div className="metric-card-value" style={{ color: '#16A34A' }}>
            <AnimatedCounter end={correctCount} />
          </div>
          <span className="metric-card-subtext" style={{ color: '#047857' }}>Out of {totalCount} attempted</span>
        </div>
      </div>

      {/* Curated Problem Recommendations Banner */}
      {curatedProblems.length > 0 && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '1rem 1.25rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#16A34A', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} /> Curated Company Problem Bank (Click to Quick-Log):
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
            {curatedProblems.slice(0, 6).map((cp) => (
              <button
                key={cp._id}
                onClick={() => handlePickCurated(cp)}
                className="btn-outline"
                style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', padding: '0.4rem 0.8rem', background: '#F8F6F1', borderColor: '#E5E7EB' }}
              >
                <strong style={{ color: '#1F2937' }}>{cp.title}</strong> &bull; <span style={{ color: '#16A34A', fontWeight: 600 }}>{cp.difficulty}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters & Search Bar */}
      <div className="filter-bar" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '0.85rem 1.25rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              placeholder="Search problem title or topic..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="search-input"
              style={{ width: '100%', padding: '0.5rem 0.85rem', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#F8F6F1', fontSize: '0.85rem' }}
            />
          </div>
          <button type="submit" className="btn-secondary" style={{ padding: '0.5rem 0.9rem' }}>
            <Search size={16} />
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.82rem', color: '#4B5563', fontWeight: 600 }}>Category:</label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="filter-select"
            style={{ padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#FFFFFF', fontSize: '0.85rem' }}
          >
            <option value="All">All Categories</option>
            <option value="DSA">DSA</option>
            <option value="Aptitude">Aptitude</option>
            <option value="SQL">SQL</option>
            <option value="Reasoning">Reasoning</option>
            <option value="Core CS">Core CS</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.82rem', color: '#4B5563', fontWeight: 600 }}>Difficulty:</label>
          <select
            value={filters.difficulty}
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
            className="filter-select"
            style={{ padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#FFFFFF', fontSize: '0.85rem' }}
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Solved Problems Table with Skeleton Loader */}
      <div className="data-table-container" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        {loading ? (
          <div>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #E5E7EB', background: '#F8F6F1', fontWeight: 600, color: '#4B5563', fontSize: '0.85rem' }}>
              Loading practice records...
            </div>
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
          </div>
        ) : history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem', color: '#6B7280' }}>
            <Code2 size={42} style={{ margin: '0 auto 1rem', color: '#16A34A', opacity: 0.8 }} />
            <h3 style={{ fontSize: '1.15rem', color: '#1F2937', marginBottom: '0.4rem', fontWeight: 700 }}>
              No practice records found
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#4B5563', marginBottom: '1.25rem' }}>
              Solve a DSA question or Aptitude problem and log it to build your daily streak!
            </p>
            <button onClick={() => setShowAddModal(true)} className="btn-primary">
              <Plus size={16} /> Log Your First Problem
            </button>
          </div>
        ) : (
          <table className="custom-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8F6F1', borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ padding: '0.9rem 1.25rem', textAlign: 'left', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563' }}>Problem Title</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'left', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563' }}>Category</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'left', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563' }}>Topic</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'left', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563' }}>Difficulty</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'left', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563' }}>Time</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'left', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563' }}>Outcome</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'left', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563' }}>Date</th>
                <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item._id} style={{ borderBottom: '1px solid #F3F4F6', transition: 'background-color 0.15s ease' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#1F2937' }}>{item.title}</td>
                  <td style={{ padding: '1rem 1rem' }}>
                    <span style={{ fontSize: '0.78rem', color: '#16A34A', fontWeight: 700, background: '#DCFCE7', padding: '0.2rem 0.55rem', borderRadius: '999px' }}>
                      {item.type}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1rem', color: '#4B5563', fontSize: '0.85rem' }}>{item.topic}</td>
                  <td style={{ padding: '1rem 1rem' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '999px',
                        background: item.difficulty === 'Easy' ? '#DCFCE7' : item.difficulty === 'Medium' ? '#FEF3C7' : '#FEE2E2',
                        color: item.difficulty === 'Easy' ? '#15803D' : item.difficulty === 'Medium' ? '#B45309' : '#B91C1C',
                      }}
                    >
                      {item.difficulty}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1rem', color: '#4B5563', fontSize: '0.85rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={13} style={{ color: '#9CA3AF' }} /> {item.timeTaken}m
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1rem' }}>
                    {item.isCorrect ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', fontWeight: 700, color: '#16A34A', background: '#DCFCE7', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                        <CheckCircle size={13} /> Correct
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', fontWeight: 700, color: '#DC2626', background: '#FEE2E2', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                        <XCircle size={13} /> Review
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem 1rem', fontSize: '0.8rem', color: '#6B7280' }}>
                    {new Date(item.solvedAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="btn-danger"
                      title="Delete record"
                      style={{ padding: '0.35rem 0.65rem' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Problem Modal (Clean White Card Layout) */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', maxWidth: '580px', width: '92%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1F2937' }}>
                Log Solved Practice Problem
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddProblem}>
              <div className="form-group">
                <label className="form-label" style={{ color: '#374151' }}>Problem Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Valid Anagram / Profit & Loss Formula"
                  value={newProblem.title}
                  onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
                  className="form-input"
                  style={{ background: '#F8F6F1', border: '1px solid #E5E7EB' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: '#374151' }}>Category</label>
                  <select
                    value={newProblem.type}
                    onChange={(e) => setNewProblem({ ...newProblem, type: e.target.value })}
                    className="form-select"
                    style={{ background: '#F8F6F1', border: '1px solid #E5E7EB' }}
                  >
                    <option value="DSA">DSA</option>
                    <option value="Aptitude">Aptitude</option>
                    <option value="SQL">SQL</option>
                    <option value="Reasoning">Reasoning</option>
                    <option value="Core CS">Core CS</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#374151' }}>Topic *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arrays, DP, Percentages"
                    value={newProblem.topic}
                    onChange={(e) => setNewProblem({ ...newProblem, topic: e.target.value })}
                    className="form-input"
                    style={{ background: '#F8F6F1', border: '1px solid #E5E7EB' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: '#374151' }}>Difficulty</label>
                  <select
                    value={newProblem.difficulty}
                    onChange={(e) => setNewProblem({ ...newProblem, difficulty: e.target.value })}
                    className="form-select"
                    style={{ background: '#F8F6F1', border: '1px solid #E5E7EB' }}
                  >
                    <option value="Easy">Easy (+10 XP)</option>
                    <option value="Medium">Medium (+20 XP)</option>
                    <option value="Hard">Hard (+35 XP)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#374151' }}>Time Taken (Minutes) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newProblem.timeTaken}
                    onChange={(e) => setNewProblem({ ...newProblem, timeTaken: Number(e.target.value) })}
                    className="form-input"
                    style={{ background: '#F8F6F1', border: '1px solid #E5E7EB' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: '#374151' }}>Outcome</label>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.25rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: '#16A34A', fontWeight: 600, fontSize: '0.88rem' }}>
                    <input
                      type="radio"
                      name="isCorrect"
                      checked={newProblem.isCorrect === true}
                      onChange={() => setNewProblem({ ...newProblem, isCorrect: true })}
                      style={{ accentColor: '#16A34A' }}
                    />
                    Solved Correctly (+XP)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: '#DC2626', fontWeight: 600, fontSize: '0.88rem' }}>
                    <input
                      type="radio"
                      name="isCorrect"
                      checked={newProblem.isCorrect === false}
                      onChange={() => setNewProblem({ ...newProblem, isCorrect: false })}
                      style={{ accentColor: '#DC2626' }}
                    />
                    Incorrect / Review Needed
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: '#374151' }}>Notes & Key Insights (Optional)</label>
                <textarea
                  rows="3"
                  placeholder="Key approach: Two pointer trick, time complexity O(N), edge cases..."
                  value={newProblem.notes}
                  onChange={(e) => setNewProblem({ ...newProblem, notes: e.target.value })}
                  className="form-textarea"
                  style={{ background: '#F8F6F1', border: '1px solid #E5E7EB' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Problem (+XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeTracker;
