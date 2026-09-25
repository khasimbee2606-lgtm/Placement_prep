import React, { useState, useEffect } from 'react';
import API from '../services/api';
import socketService from '../services/socket';
import { useAuth } from '../context/AuthContext';
import { TableRowSkeleton } from '../components/SkeletonLoader';
import {
  Trophy,
  Flame,
  Award,
  Sparkles,
  Radio,
  RefreshCw,
  Crown,
  Medal,
  User
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
      setLoading(true);
      const res = await API.get('/leaderboard');
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
    const handleLeaderboardUpdate = () => {
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
    <div className="page-transition">
      <div className="page-header" style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1F2937' }}>
            Campus <span style={{ color: '#16A34A' }}>Leaderboard</span>
          </h1>
          <p className="page-subtitle" style={{ fontSize: '0.88rem', color: '#6B7280' }}>
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
              background: '#DCFCE7',
              color: '#065F46',
              border: '1px solid #A7F3D0',
            }}
          >
            <Radio size={14} className="animated-pulse" style={{ color: '#16A34A' }} />
            Socket.io Live Sync
          </span>
          <button onClick={fetchLeaderboard} className="btn-outline" title="Refresh Rankings" style={{ padding: '0.45rem 0.8rem' }}>
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Real-time Flash alert */}
      {realtimeNotice && (
        <div
          style={{
            background: '#DCFCE7',
            border: '1px solid #16A34A',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.88rem',
            color: '#065F46',
            fontWeight: 600,
          }}
        >
          <Sparkles size={16} style={{ color: '#16A34A' }} /> Live Update: Candidate completed a challenge! Rankings updated.
        </div>
      )}

      {/* Top 3 Podium Cards (Gold & Green Emphasis) */}
      {topThree.length >= 3 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem',
            alignItems: 'end',
          }}
        >
          {/* Rank 2 - Silver / Green Emphasis */}
          <div
            className="metric-card"
            style={{
              background: '#FFFFFF',
              border: '2px solid #A7F3D0',
              borderTop: '4px solid #16A34A',
              borderRadius: '16px',
              textAlign: 'center',
              padding: '1.5rem 1.25rem',
              boxShadow: '0 4px 16px -2px rgba(22, 163, 74, 0.1)',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: '#DCFCE7',
                color: '#16A34A',
                fontWeight: 800,
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem',
                border: '2px solid #86EFAC',
              }}
            >
              2
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#F3F4F6', color: '#1F2937', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', border: '2px solid #E5E7EB' }}>
              {topThree[1].name.charAt(0)}
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1F2937' }}>{topThree[1].name}</h3>
            <p style={{ fontSize: '0.78rem', color: '#6B7280', marginBottom: '0.75rem' }}>{topThree[1].college}</p>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16A34A' }}>
              {topThree[1].points} <span style={{ fontSize: '0.85rem', color: '#065F46' }}>XP</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem', fontSize: '0.78rem', color: '#B45309', fontWeight: 600 }}>
              <Flame size={14} /> {topThree[1].streak} Days Streak
            </div>
          </div>

          {/* Rank 1 - Gold / Green Crown Podium (Elevated) */}
          <div
            className="metric-card"
            style={{
              background: 'linear-gradient(135deg, #FEF3C7 0%, #FFFFFF 100%)',
              border: '2.5px solid #F59E0B',
              borderTop: '5px solid #D97706',
              borderRadius: '16px',
              textAlign: 'center',
              padding: '2rem 1.25rem',
              boxShadow: '0 10px 25px -4px rgba(245, 158, 11, 0.25), 0 4px 12px rgba(22, 163, 74, 0.1)',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: 'white',
                fontWeight: 900,
                fontSize: '1.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem',
                boxShadow: '0 0 16px rgba(245, 158, 11, 0.5)',
              }}
            >
              👑 1
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FEF3C7', color: '#B45309', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', border: '2px solid #F59E0B', fontSize: '1.1rem' }}>
              {topThree[0].name.charAt(0)}
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1F2937' }}>{topThree[0].name}</h3>
            <p style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 600, marginBottom: '0.75rem' }}>{topThree[0].college}</p>
            <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#B45309' }}>
              {topThree[0].points} <span style={{ fontSize: '1rem', color: '#D97706' }}>XP</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem', fontSize: '0.84rem', color: '#B45309', fontWeight: 700 }}>
              <Flame size={16} /> {topThree[0].streak} Days Daily Streak 🔥
            </div>
          </div>

          {/* Rank 3 - Bronze / Accent Green */}
          <div
            className="metric-card"
            style={{
              background: '#FFFFFF',
              border: '2px solid #E5E7EB',
              borderTop: '4px solid #22C55E',
              borderRadius: '16px',
              textAlign: 'center',
              padding: '1.5rem 1.25rem',
              boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.05)',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: '#F8F6F1',
                color: '#B45309',
                fontWeight: 800,
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem',
                border: '2px solid #E5E7EB',
              }}
            >
              3
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#F3F4F6', color: '#1F2937', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', border: '2px solid #E5E7EB' }}>
              {topThree[2].name.charAt(0)}
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1F2937' }}>{topThree[2].name}</h3>
            <p style={{ fontSize: '0.78rem', color: '#6B7280', marginBottom: '0.75rem' }}>{topThree[2].college}</p>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16A34A' }}>
              {topThree[2].points} <span style={{ fontSize: '0.85rem', color: '#065F46' }}>XP</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem', fontSize: '0.78rem', color: '#B45309', fontWeight: 600 }}>
              <Flame size={14} /> {topThree[2].streak} Days Streak
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard Table with Current User Row Highlight */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        {loading ? (
          <div>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #E5E7EB', background: '#F8F6F1', fontWeight: 600, color: '#4B5563', fontSize: '0.85rem' }}>
              Updating live leaderboard standings...
            </div>
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8F6F1', borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ padding: '0.9rem 1.25rem', textAlign: 'left', width: '70px', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563' }}>Rank</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'left', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563' }}>Candidate</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'left', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563' }}>College / Institute</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'left', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563' }}>Target Track</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'left', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563' }}>Streak</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'left', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563' }}>Problems</th>
                <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563' }}>XP</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((cand) => {
                const isUser = cand.isCurrentUser;
                return (
                  <tr
                    key={cand._id}
                    style={{
                      background: isUser ? '#DCFCE7' : 'transparent',
                      borderBottom: '1px solid',
                      borderColor: isUser ? '#86EFAC' : '#F3F4F6',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <td style={{ padding: '0.95rem 1.25rem' }}>
                      <span
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          background: cand.rank === 1 ? '#FEF3C7' : cand.rank === 2 ? '#DCFCE7' : cand.rank === 3 ? '#F3F4F6' : '#F9FAFB',
                          color: cand.rank === 1 ? '#B45309' : cand.rank === 2 ? '#16A34A' : cand.rank === 3 ? '#4B5563' : '#6B7280',
                          border: cand.rank === 1 ? '1.5px solid #F59E0B' : '1px solid #E5E7EB',
                        }}
                      >
                        {cand.rank}
                      </span>
                    </td>
                    <td style={{ padding: '0.95rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            background: isUser ? '#16A34A' : '#E5E7EB',
                            color: isUser ? '#FFFFFF' : '#1F2937',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.82rem',
                            flexShrink: 0,
                          }}
                        >
                          {cand.name ? cand.name.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.92rem', color: isUser ? '#065F46' : '#1F2937' }}>
                            {cand.name}
                          </strong>
                          {isUser && (
                            <span style={{ marginLeft: '0.5rem', fontSize: '0.72rem', background: '#16A34A', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: 700 }}>
                              YOU
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.95rem 1rem', color: '#4B5563', fontSize: '0.85rem' }}>{cand.college}</td>
                    <td style={{ padding: '0.95rem 1rem' }}>
                      <span style={{ fontSize: '0.78rem', color: '#16A34A', fontWeight: 600, background: isUser ? '#FFFFFF' : '#DCFCE7', padding: '0.2rem 0.55rem', borderRadius: '999px' }}>
                        {cand.targetCompany}
                      </span>
                    </td>
                    <td style={{ padding: '0.95rem 1rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#B45309', fontWeight: 600, fontSize: '0.85rem' }}>
                        <Flame size={14} /> {cand.streak} Days
                      </span>
                    </td>
                    <td style={{ padding: '0.95rem 1rem', color: '#4B5563', fontSize: '0.85rem' }}>
                      {cand.problemsSolved} Solved
                    </td>
                    <td style={{ padding: '0.95rem 1.25rem', textAlign: 'right', fontWeight: 800, color: '#16A34A', fontSize: '1.05rem' }}>
                      {cand.points} XP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
