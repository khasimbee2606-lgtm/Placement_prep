import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Code2,
  Sparkles,
  BookOpen,
  X,
  TrendingUp,
  Layers
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

        // Trigger green confetti celebration
        try {
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#10b981', '#34d399', '#059669', '#6ee7b7'],
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
      console.error('Error deleting entry:', err);
    }
  };

  const handlePickCurated = (curated) => {
    setNewProblem({
      title: curated.title,
      type: curated.type,
      topic: curated.topic,
      difficulty: curated.difficulty,
      timeTaken: 20,
      isCorrect: true,
      notes: curated.description || '',
    });
    setShowAddModal(true);
  };

  const totalCount = history.length;
  const correctCount = history.filter((h) => h.isCorrect).length;
  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const totalMinutes = history.reduce((acc, curr) => acc + (curr.timeTaken || 0), 0);

  return (
    <div>
      {/* Toast Notification */}
      {notification.show && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: notification.type === 'success' ? '#047857' : '#991b1b',
            color: 'white',
            padding: '0.85rem 1.25rem',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          <Sparkles size={18} />
          <span>{notification.msg}</span>
          <button
            onClick={() => setNotification({ ...notification, show: false })}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginLeft: '0.5rem' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Practice <span className="green-gradient-text">Tracker</span>
          </h1>
          <p className="page-subtitle">
            Log solved problems across DSA, Aptitude, SQL & Reasoning to build placement consistency.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setShowAddModal(true)} className="btn-primary">
            <Plus size={18} />
            <span>Log Solved Problem</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="stats-cards-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-card-label">Total Problems Solved</span>
            <div className="metric-card-icon"><Code2 size={20} /></div>
          </div>
          <div className="metric-card-value">{totalCount}</div>
          <span className="metric-card-subtext">Verified practice logs</span>
        </div>

        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-card-label">Accuracy Rate</span>
            <div className="metric-card-icon"><TrendingUp size={20} /></div>
          </div>
          <div className="metric-card-value" style={{ color: accuracy >= 60 ? '#34d399' : '#fb7185' }}>
            {accuracy}%
          </div>
          <span className="metric-card-subtext">Passing threshold: 60%</span>
        </div>

        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-card-label">Total Time Invested</span>
            <div className="metric-card-icon"><Clock size={20} /></div>
          </div>
          <div className="metric-card-value">{totalMinutes} <span style={{ fontSize: '1rem', color: '#9cd4b5' }}>mins</span></div>
          <span className="metric-card-subtext">Average {(totalCount > 0 ? (totalMinutes / totalCount).toFixed(1) : 0)} mins/problem</span>
        </div>

        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-card-label">Correct Submissions</span>
            <div className="metric-card-icon"><CheckCircle size={20} /></div>
          </div>
          <div className="metric-card-value">{correctCount}</div>
          <span className="metric-card-subtext">Out of {totalCount} attempted</span>
        </div>
      </div>

      {/* Curated Problem Recommendations Banner */}
      {curatedProblems.length > 0 && (
        <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} /> Curated Company Problem Bank (Click to Quick-Log):
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
            {curatedProblems.slice(0, 5).map((cp) => (
              <button
                key={cp._id}
                onClick={() => handlePickCurated(cp)}
                className="btn-outline"
                style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', padding: '0.4rem 0.8rem', background: '#0a140f' }}
              >
                <strong>{cp.title}</strong> &bull; <span style={{ color: '#34d399' }}>{cp.difficulty}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters & Search Bar */}
      <div className="filter-bar">
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <input
              type="text"
              placeholder="Search problem title or topic..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="search-input"
              style={{ width: '100%' }}
            />
          </div>
          <button type="submit" className="btn-secondary" style={{ padding: '0.5rem 0.9rem' }}>
            <Search size={16} />
          </button>
        </form>

        <div className="filter-group">
          <label style={{ fontSize: '0.8rem', color: '#9cd4b5', fontWeight: 600 }}>Type:</label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="filter-select"
          >
            <option value="All">All Categories</option>
            <option value="DSA">DSA</option>
            <option value="Aptitude">Aptitude</option>
            <option value="SQL">SQL</option>
            <option value="Reasoning">Reasoning</option>
            <option value="Core CS">Core CS</option>
          </select>
        </div>

        <div className="filter-group">
          <label style={{ fontSize: '0.8rem', color: '#9cd4b5', fontWeight: 600 }}>Difficulty:</label>
          <select
            value={filters.difficulty}
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
            className="filter-select"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Solved Problems Table */}
      <div className="data-table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#34d399' }}>
            Loading your practice history...
          </div>
        ) : history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem', color: '#9cd4b5' }}>
            <Code2 size={40} style={{ margin: '0 auto 1rem', opacity: 0.5, color: '#10b981' }} />
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.4rem' }}>
              No practice records found
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#6ee7b7', marginBottom: '1.25rem' }}>
              Solve a DSA question or Aptitude problem and log it to build your daily streak!
            </p>
            <button onClick={() => setShowAddModal(true)} className="btn-primary">
              <Plus size={16} /> Log Your First Problem
            </button>
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Problem Title</th>
                <th>Category</th>
                <th>Topic</th>
                <th>Difficulty</th>
                <th>Time Spent</th>
                <th>Outcome</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item._id}>
                  <td style={{ fontWeight: 600, color: '#f0fdf4' }}>{item.title}</td>
                  <td>
                    <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700 }}>
                      {item.type}
                    </span>
                  </td>
                  <td style={{ color: '#cbd5e1' }}>{item.topic}</td>
                  <td>
                    <span className={`badge badge-${item.difficulty.toLowerCase()}`}>
                      {item.difficulty}
                    </span>
                  </td>
                  <td style={{ color: '#9cd4b5' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={13} /> {item.timeTaken} mins
                    </span>
                  </td>
                  <td>
                    {item.isCorrect ? (
                      <span className="badge badge-correct">
                        <CheckCircle size={13} /> Correct
                      </span>
                    ) : (
                      <span className="badge badge-incorrect">
                        <XCircle size={13} /> Incorrect
                      </span>
                    )}
                  </td>
                  <td style={{ fontSize: '0.8rem', color: '#6ee7b7' }}>
                    {new Date(item.solvedAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="btn-danger"
                      title="Delete record"
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

      {/* Add Problem Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff' }}>
                Log Solved Practice Problem
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', color: '#9cd4b5', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddProblem}>
              <div className="form-group">
                <label className="form-label">Problem Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Valid Anagram / Profit & Loss Formula"
                  value={newProblem.title}
                  onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={newProblem.type}
                    onChange={(e) => setNewProblem({ ...newProblem, type: e.target.value })}
                    className="form-select"
                  >
                    <option value="DSA">DSA</option>
                    <option value="Aptitude">Aptitude</option>
                    <option value="SQL">SQL</option>
                    <option value="Reasoning">Reasoning</option>
                    <option value="Core CS">Core CS</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Topic *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arrays, DP, Percentages"
                    value={newProblem.topic}
                    onChange={(e) => setNewProblem({ ...newProblem, topic: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <select
                    value={newProblem.difficulty}
                    onChange={(e) => setNewProblem({ ...newProblem, difficulty: e.target.value })}
                    className="form-select"
                  >
                    <option value="Easy">Easy (+10 XP)</option>
                    <option value="Medium">Medium (+20 XP)</option>
                    <option value="Hard">Hard (+35 XP)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Time Taken (Minutes) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newProblem.timeTaken}
                    onChange={(e) => setNewProblem({ ...newProblem, timeTaken: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Outcome</label>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.2rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: '#34d399' }}>
                    <input
                      type="radio"
                      name="isCorrect"
                      checked={newProblem.isCorrect === true}
                      onChange={() => setNewProblem({ ...newProblem, isCorrect: true })}
                    />
                    Solved Correctly (+XP)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: '#fb7185' }}>
                    <input
                      type="radio"
                      name="isCorrect"
                      checked={newProblem.isCorrect === false}
                      onChange={() => setNewProblem({ ...newProblem, isCorrect: false })}
                    />
                    Incorrect / Needed Solution
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes & Insights (Optional)</label>
                <textarea
                  rows="3"
                  placeholder="Key approach: Two pointer trick, time complexity O(N), edge case handled..."
                  value={newProblem.notes}
                  onChange={(e) => setNewProblem({ ...newProblem, notes: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
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
