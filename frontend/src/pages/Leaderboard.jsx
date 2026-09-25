import React, { useState, useEffect } from 'react';
import API from '../services/api';
import socketService from '../services/socket';
import { useAuth } from '../context/AuthContext';
import {
  Trophy,
  Flame,
  Award,
  Sparkles,
  GraduationCap,
  Briefcase,
  Radio,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [loading, setLoading] = useState(true);
  const [realtimeNotice, setRealtimeNotice] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      const res = await API.get('/api/leaderboard');
      if (res.data.success) {
        setLeaderboard(res.data.leaderboard || []);
        setCurrentUserRank(res.data.currentUserRank);
        setTotalParticipants(res.data.totalParticipants);
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    // Listen to real-time socket.io leaderboard updates
    const handleLeaderboardUpdate = (data) => {
      setRealtimeNotice(true);
      fetchLeaderboard();
      setTimeout(() => setRealtimeNotice(false), 3000);
    };

    socketService.on('leaderboard_updated', handleLeaderboardUpdate);

    return () => {
      socketService.off('leaderboard_updated', handleLeaderboardUpdate);
    };
  }, []);

  const topThree = leaderboard.slice(0, 3);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Campus <span className="green-gradient-text">Leaderboard</span>
          </h1>
          <p className="page-subtitle">
            Real-time rankings based on verified problem solving, daily streaks, and mock assessment XP.
          </p>
        </div>

        {/* Real-time Socket Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              padding: '0.35rem 0.8rem',
              borderRadius: '999px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            <Radio size={14} className="animated-pulse" />
            Socket.io Live Sync
          </span>
          <button onClick={fetchLeaderboard} className="btn-outline" title="Refresh Rankings">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Real-time Flash alert */}
      {realtimeNotice && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid #10b981',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            color: '#34d399',
            fontWeight: 600,
          }}
        >
          <Sparkles size={16} /> Live Update: Candidate completed a challenge! Rankings updated in real-time.
        </div>
      )}

      {/* Top 3 Podium Cards */}
      {topThree.length >= 3 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.25rem',
            marginBottom: '2rem',
          }}
        >
          {/* Rank 2 - Silver */}
          <div
            className="metric-card"
            style={{
              borderTop: '3px solid #94a3b8',
              transform: 'scale(0.96)',
              textAlign: 'center',
              alignItems: 'center',
            }}
          >
            <div className="rank-badge rank-2" style={{ width: '42px', height: '42px', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              2
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>{topThree[1].name}</h3>
            <p style={{ fontSize: '0.75rem', color: '#9cd4b5', marginBottom: '0.75rem' }}>{topThree[1].college}</p>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>
              {topThree[1].points} <span style={{ fontSize: '0.8rem', color: '#9cd4b5' }}>XP</span>
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.75rem', color: '#fbbf24' }}>
              <Flame size={14} /> {topThree[1].streak} Days Streak
            </div>
          </div>

          {/* Rank 1 - Gold (Elevated) */}
          <div
            className="metric-card"
            style={{
              borderTop: '3px solid #f59e0b',
              background: 'linear-gradient(145deg, rgba(20, 38, 28, 0.95) 0%, rgba(12, 22, 16, 0.95) 100%)',
              boxShadow: '0 8px 30px rgba(16, 185, 129, 0.25)',
              textAlign: 'center',
              alignItems: 'center',
            }}
          >
            <div className="rank-badge rank-1" style={{ width: '48px', height: '48px', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
              👑 1
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>{topThree[0].name}</h3>
            <p style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600, marginBottom: '0.75rem' }}>{topThree[0].college}</p>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24' }}>
              {topThree[0].points} <span style={{ fontSize: '0.9rem', color: '#fcd34d' }}>XP</span>
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.8rem', color: '#fbbf24', fontWeight: 700 }}>
              <Flame size={16} /> {topThree[0].streak} Days Daily Streak 🔥
            </div>
          </div>

          {/* Rank 3 - Bronze */}
          <div
            className="metric-card"
            style={{
              borderTop: '3px solid #b45309',
              transform: 'scale(0.94)',
              textAlign: 'center',
              alignItems: 'center',
            }}
          >
            <div className="rank-badge rank-3" style={{ width: '40px', height: '40px', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              3
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>{topThree[2].name}</h3>
            <p style={{ fontSize: '0.75rem', color: '#9cd4b5', marginBottom: '0.75rem' }}>{topThree[2].college}</p>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>
              {topThree[2].points} <span style={{ fontSize: '0.8rem', color: '#9cd4b5' }}>XP</span>
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.75rem', color: '#fbbf24' }}>
              <Flame size={14} /> {topThree[2].streak} Days Streak
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="data-table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#34d399' }}>
            Fetching latest rankings...
          </div>
        ) : (
          <table className="custom-table leaderboard-table">
            <thead>
              <tr>
                <th style={{ width: '70px' }}>Rank</th>
                <th>Candidate Name</th>
                <th>College / Institute</th>
                <th>Target Company Track</th>
                <th>Daily Streak</th>
                <th>Problems Solved</th>
                <th style={{ textAlign: 'right' }}>Total XP</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((cand) => (
                <tr
                  key={cand._id}
                  className={cand.isCurrentUser ? 'current-user-row' : ''}
                >
                  <td>
                    <span className={`rank-badge ${cand.rank === 1 ? 'rank-1' : cand.rank === 2 ? 'rank-2' : cand.rank === 3 ? 'rank-3' : 'rank-other'}`}>
                      {cand.rank}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: cand.isCurrentUser ? '#34d399' : '#f0fdf4' }}>
                    {cand.name} {cand.isCurrentUser && <span style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 700 }}>(You)</span>}
                  </td>
                  <td style={{ color: '#cbd5e1' }}>{cand.college}</td>
                  <td>
                    <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 600 }}>
                      {cand.targetCompany}
                    </span>
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#fbbf24', fontWeight: 600 }}>
                      <Flame size={14} /> {cand.streak} Days
                    </span>
                  </td>
                  <td style={{ color: '#9cd4b5' }}>{cand.problemsSolved} Solved</td>
                  <td style={{ textAlign: 'right', fontWeight: 800, color: '#34d399', fontSize: '1rem' }}>
                    {cand.points} XP
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
