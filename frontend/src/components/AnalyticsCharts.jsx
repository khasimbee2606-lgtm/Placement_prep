import React, { useState } from 'react';

// 1. Topic-wise Accuracy Bar Chart with 60% Weak Area Threshold
export const TopicAccuracyChart = ({ data = [] }) => {
  const [hoveredTopic, setHoveredTopic] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2.5rem', color: '#6ee7b7' }}>
        No topic data available yet. Solve problems to visualize accuracy!
      </div>
    );
  }

  // Display top 8 topics
  const displayData = data.slice(0, 8);

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      {/* 60% Cut-off indicator note */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.8rem', color: '#9cd4b5' }}>
        <span>Target: <strong>&ge; 60% Accuracy</strong> to clear company screening</span>
        <span style={{ color: '#fbbf24', fontWeight: 600 }}>&bull; Red/Amber = Weak Areas (&lt; 60%)</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {displayData.map((item, idx) => {
          const isWeak = item.accuracy < 60;
          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredTopic(item)}
              onMouseLeave={() => setHoveredTopic(null)}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 600, color: isWeak ? '#fbbf24' : '#f0fdf4' }}>
                  {item.topic} <span style={{ fontSize: '0.75rem', color: '#6ee7b7' }}>({item.category})</span>
                </span>
                <span style={{ fontWeight: 700, color: isWeak ? '#fb7185' : '#34d399' }}>
                  {item.accuracy}% {isWeak && '⚠️ Needs Practice'}
                </span>
              </div>

              {/* Progress Rail */}
              <div
                style={{
                  width: '100%',
                  height: '10px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '999px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* 60% Threshold Marker */}
                <div
                  style={{
                    position: 'absolute',
                    left: '60%',
                    top: 0,
                    bottom: 0,
                    width: '2px',
                    background: 'rgba(255, 255, 255, 0.3)',
                    zIndex: 2,
                  }}
                  title="60% Passing Cutoff"
                />

                {/* Fill Bar */}
                <div
                  style={{
                    width: `${Math.min(100, item.accuracy)}%`,
                    height: '100%',
                    borderRadius: '999px',
                    background: isWeak
                      ? 'linear-gradient(90deg, #f43f5e 0%, #f59e0b 100%)'
                      : 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
                    transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#6ee7b7' }}>
                <span>Solved: {item.correct}/{item.total} correct</span>
                <span>Avg Time: {item.avgTime} mins/question</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 2. Trend Curve Chart (SVG Area with Green Gradient)
export const ProgressTrendChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#6ee7b7' }}>
        Log daily problems to see your weekly performance curve!
      </div>
    );
  }

  const height = 180;
  const width = 450;
  const padding = 30;

  const maxVal = Math.max(...data.map((d) => d.timeTaken || 10), 30);
  const minVal = 0;

  const points = data.map((d, i) => {
    const x = padding + (i / Math.max(1, data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((d.timeTaken - minVal) / (maxVal - minVal || 1)) * (height - 2 * padding);
    return { x, y, title: d.title, time: d.timeTaken };
  });

  const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  const areaD = `${pathD} L ${points[points.length - 1]?.x || width} ${height - padding} L ${points[0]?.x || 0} ${height - padding} Z`;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', maxHeight: '200px' }}>
        <defs>
          <linearGradient id="emeraldGradientArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="emeraldLineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

        {/* Area & Stroke */}
        <path d={areaD} fill="url(#emeraldGradientArea)" />
        <path d={pathD} fill="none" stroke="url(#emeraldLineGrad)" strokeWidth="3" strokeLinecap="round" />

        {/* Data Points */}
        {points.map((p, idx) => (
          <g key={idx}>
            <circle cx={p.x} cy={p.y} r="4.5" fill="#34d399" stroke="#060a08" strokeWidth="2" />
          </g>
        ))}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6ee7b7', padding: '0 0.5rem' }}>
        <span>&larr; Earlier Practice</span>
        <span>Recent Velocity &rarr;</span>
      </div>
    </div>
  );
};

// 3. Difficulty Donut & Placement Readiness Circular Gauge
export const DifficultyDonutChart = ({ difficultyStats = [], readinessScore = 75 }) => {
  const easy = difficultyStats.find((d) => d.difficulty === 'Easy')?.count || 0;
  const medium = difficultyStats.find((d) => d.difficulty === 'Medium')?.count || 0;
  const hard = difficultyStats.find((d) => d.difficulty === 'Hard')?.count || 0;
  const total = easy + medium + hard || 1;

  const easyPct = Math.round((easy / total) * 100);
  const medPct = Math.round((medium / total) * 100);
  const hardPct = Math.round((hard / total) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
      {/* Circular Gauge */}
      <div style={{ position: 'relative', width: '140px', height: '140px' }}>
        <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="3.2"
          />
          {/* Readiness Stroke */}
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#10b981"
            strokeWidth="3.4"
            strokeDasharray={`${readinessScore}, 100`}
            strokeLinecap="round"
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f0fdf4' }}>{readinessScore}%</span>
          <span style={{ fontSize: '0.65rem', color: '#34d399', textTransform: 'uppercase', fontWeight: 700 }}>
            Readiness
          </span>
        </div>
      </div>

      {/* Difficulty Legend */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
            Easy ({easy})
          </span>
          <span style={{ fontWeight: 600 }}>{easyPct}%</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
            Medium ({medium})
          </span>
          <span style={{ fontWeight: 600 }}>{medPct}%</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fb7185' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f43f5e' }} />
            Hard ({hard})
          </span>
          <span style={{ fontWeight: 600 }}>{hardPct}%</span>
        </div>
      </div>
    </div>
  );
};
