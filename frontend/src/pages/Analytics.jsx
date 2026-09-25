import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  TopicAccuracyChart,
  ProgressTrendChart,
  DifficultyDonutChart
} from '../components/AnalyticsCharts';
import {
  BarChart3,
  AlertTriangle,
  Clock,
  Target,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  BrainCircuit
} from 'lucide-react';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await API.get('/analytics');
      if (res.data.success) {
        setData(res.data.analytics);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', color: '#34d399' }}>
        Calculating placement performance analytics...
      </div>
    );
  }

  const summary = data?.summary || {};
  const weakAreas = data?.weakAreas || [];
  const topicAccuracyList = data?.topicAccuracyList || [];
  const difficultyStats = data?.difficultyStats || [];
  const recentTrend = data?.recentTrend || [];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Analytics & <span className="green-gradient-text">Weak-Area Engine</span>
          </h1>
          <p className="page-subtitle">
            Diagnostics to identify topics below 60% accuracy and ensure day-1 placement readiness.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="stats-cards-grid" style={{ marginBottom: '2rem' }}>
        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-card-label">Overall Accuracy</span>
            <div className="metric-card-icon"><Target size={20} /></div>
          </div>
          <div className="metric-card-value" style={{ color: summary.overallAccuracy >= 60 ? '#34d399' : '#fb7185' }}>
            {summary.overallAccuracy || 0}%
          </div>
          <span className="metric-card-subtext">Across {summary.totalProblems || 0} solved problems</span>
        </div>

        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-card-label">Avg Time / Question</span>
            <div className="metric-card-icon"><Clock size={20} /></div>
          </div>
          <div className="metric-card-value">
            {summary.avgTimePerQuestion || 0} <span style={{ fontSize: '1rem', color: '#9cd4b5' }}>mins</span>
          </div>
          <span className="metric-card-subtext">Target: &lt; 20 mins for Medium DSA</span>
        </div>

        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-card-label">Identified Weak Areas</span>
            <div className="metric-card-icon" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="metric-card-value" style={{ color: weakAreas.length > 0 ? '#fbbf24' : '#34d399' }}>
            {weakAreas.length} <span style={{ fontSize: '1rem', color: '#9cd4b5' }}>Topics</span>
          </div>
          <span className="metric-card-subtext">Topics under 60% passing cut-off</span>
        </div>

        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-card-label">Readiness Index</span>
            <div className="metric-card-icon"><Sparkles size={20} /></div>
          </div>
          <div className="metric-card-value" style={{ color: '#10b981' }}>
            {summary.readinessScore || 75}%
          </div>
          <span className="metric-card-subtext">Weighted readiness composite</span>
        </div>
      </div>

      {/* Weak Areas Alert Box */}
      {weakAreas.length > 0 ? (
        <div className="weak-areas-box">
          <div className="weak-areas-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={20} /> Weak-Area Action Required (&lt; 60% Accuracy)
            </span>
            <span style={{ fontSize: '0.75rem', background: 'rgba(245, 158, 11, 0.2)', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
              High Priority
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#fef3c7', marginBottom: '1rem', lineHeight: 1.5 }}>
            Recruiters filter out candidates based on minimum sectional cut-offs. The following topics currently drop your evaluation score below 60%:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {weakAreas.map((w, idx) => (
              <div key={idx} className="weak-area-item">
                <div>
                  <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
                    {w.topic}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#6ee7b7', marginLeft: '0.5rem' }}>
                    ({w.category})
                  </span>
                  <p style={{ fontSize: '0.78rem', color: '#fcd34d', marginTop: '0.2rem' }}>
                    {w.recommendation}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fb7185' }}>
                    {w.accuracy}%
                  </span>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: '#fbbf24' }}>
                    {w.correct}/{w.total} correct
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CheckCircle2 size={24} style={{ color: '#34d399' }} />
          <div>
            <strong style={{ color: '#ffffff' }}>No Critical Weak Areas Detected!</strong>
            <p style={{ fontSize: '0.85rem', color: '#a7f3d0' }}>
              All practiced topics are above the 60% placement threshold. Maintain your daily streak to stay sharp!
            </p>
          </div>
        </div>
      )}

      {/* Main Charts Grid */}
      <div className="analytics-grid">
        {/* Left Column: Topic Accuracy Bars & Trend */}
        <div>
          {/* Topic-Wise Accuracy */}
          <div className="chart-card">
            <h3 className="chart-card-title">
              <BrainCircuit size={18} style={{ color: '#34d399' }} /> Topic Accuracy Breakdown (With 60% Cutoff)
            </h3>
            <TopicAccuracyChart data={topicAccuracyList} />
          </div>

          {/* Recent Practice Curve */}
          <div className="chart-card">
            <h3 className="chart-card-title">
              <TrendingUp size={18} style={{ color: '#10b981' }} /> Practice Velocity Curve (Time Spent mins)
            </h3>
            <ProgressTrendChart data={recentTrend} />
          </div>
        </div>

        {/* Right Column: Readiness & Difficulty Gauge */}
        <div>
          <div className="chart-card">
            <h3 className="chart-card-title">
              <ShieldCheck size={18} style={{ color: '#34d399' }} /> Placement Readiness Gauge
            </h3>
            <DifficultyDonutChart
              difficultyStats={difficultyStats}
              readinessScore={summary.readinessScore || 75}
            />
          </div>

          {/* Tips Card */}
          <div style={{ background: 'rgba(16, 185, 129, 0.06)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399', marginBottom: '0.5rem' }}>
              💡 Campus Strategy Note
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#9cd4b5', lineHeight: 1.5 }}>
              For service giants (TCS, Infosys, Wipro), aptitude & logical reasoning speed is crucial. For product firms (Amazon, Google), depth in Medium/Hard DSA with clean time complexities is decisive.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
