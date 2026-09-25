import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine
} from 'recharts';

// Green Color Palette
const GREEN_SHADES = ['#16A34A', '#22C55E', '#065F46', '#86EFAC', '#15803D', '#34D399', '#A7F3D0'];

// Custom Tooltip component for consistent LinkedIn styling
const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '8px',
          padding: '0.65rem 0.85rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          fontSize: '0.82rem',
        }}
      >
        <p style={{ fontWeight: 700, color: '#1F2937', marginBottom: '0.25rem' }}>{label || payload[0]?.name}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color || '#16A34A', fontWeight: 600 }}>
            {entry.name}: {entry.value} {entry.unit || ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// 1. Line Chart: Progress Over Time
export const ProgressLineChart = ({ data = [] }) => {
  // If data is empty or too short, generate a realistic 7-day progress trail
  const chartData = data && data.length > 0 ? data.map((d, idx) => ({
    name: d.date ? d.date.slice(5) : `Day ${idx + 1}`,
    timeTaken: Number(d.timeTaken) || 15,
    problems: Number(d.count) || idx + 1,
  })) : [
    { name: 'Mon', timeTaken: 22, problems: 2 },
    { name: 'Tue', timeTaken: 19, problems: 4 },
    { name: 'Wed', timeTaken: 16, problems: 7 },
    { name: 'Thu', timeTaken: 18, problems: 10 },
    { name: 'Fri', timeTaken: 14, problems: 14 },
    { name: 'Sat', timeTaken: 12, problems: 19 },
    { name: 'Sun', timeTaken: 11, problems: 24 },
  ];

  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="progressLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#16A34A" />
              <stop offset="50%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#065F46" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} />
          <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} unit="m" />
          <Tooltip content={<CustomChartTooltip />} />
          <Line
            type="monotone"
            dataKey="timeTaken"
            name="Avg Time (mins)"
            stroke="url(#progressLineGrad)"
            strokeWidth={3}
            dot={{ r: 4, fill: '#16A34A', stroke: '#FFFFFF', strokeWidth: 2 }}
            activeDot={{ r: 7, fill: '#22C55E' }}
            isAnimationActive={true}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// 2. Pie Chart: Topic Distribution
export const TopicPieChart = ({ data = [] }) => {
  const chartData = data && data.length > 0 ? data : [
    { name: 'DSA (Algorithms)', value: 42 },
    { name: 'Quantitative Aptitude', value: 24 },
    { name: 'SQL & DBMS', value: 18 },
    { name: 'Core CS (OS/Networks)', value: 16 },
  ];

  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
            isAnimationActive={true}
            animationDuration={1100}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={GREEN_SHADES[index % GREEN_SHADES.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomChartTooltip />} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ fontSize: '0.78rem', color: '#4B5563', paddingTop: '10px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// 3. Bar Chart: Accuracy Per Topic with 60% Cutoff Line
export const TopicAccuracyBarChart = ({ data = [] }) => {
  const chartData = data && data.length > 0 ? data.slice(0, 8).map((d) => ({
    topic: d.topic?.length > 12 ? `${d.topic.slice(0, 11)}...` : d.topic,
    fullTopic: d.topic,
    accuracy: Number(d.accuracy) || 0,
    category: d.category || 'DSA',
  })) : [
    { topic: 'Arrays', fullTopic: 'Arrays & Hashing', accuracy: 82, category: 'DSA' },
    { topic: 'DP', fullTopic: 'Dynamic Programming', accuracy: 52, category: 'DSA' },
    { topic: 'Strings', fullTopic: 'Two Pointers & Strings', accuracy: 75, category: 'DSA' },
    { topic: 'Trees', fullTopic: 'Binary Trees & Graphs', accuracy: 68, category: 'DSA' },
    { topic: 'Time & Work', fullTopic: 'Time, Speed & Work', accuracy: 48, category: 'Aptitude' },
    { topic: 'SQL Joins', fullTopic: 'Complex SQL Joins', accuracy: 88, category: 'SQL' },
    { topic: 'OS Locks', fullTopic: 'Deadlocks & Semaphores', accuracy: 64, category: 'Core CS' },
  ];

  return (
    <div style={{ width: '100%', height: 290 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 15, right: 20, left: -10, bottom: 25 }}>
          <defs>
            <linearGradient id="barGreenGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#16A34A" />
            </linearGradient>
            <linearGradient id="barAmberGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis
            dataKey="topic"
            stroke="#9CA3AF"
            fontSize={11}
            tickLine={false}
            interval={0}
            angle={-20}
            textAnchor="end"
          />
          <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} domain={[0, 100]} unit="%" />
          <Tooltip
            formatter={(value, name, item) => [`${value}%`, `Accuracy (${item.payload.category})`]}
            labelFormatter={(label, items) => items[0]?.payload?.fullTopic || label}
            contentStyle={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '0.82rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            }}
          />
          {/* 60% Passing Cutoff Reference Line */}
          <ReferenceLine
            y={60}
            stroke="#EF4444"
            strokeDasharray="4 4"
            label={{ value: '60% Cutoff', position: 'top', fill: '#DC2626', fontSize: 11 }}
          />
          <Bar
            dataKey="accuracy"
            radius={[6, 6, 0, 0]}
            isAnimationActive={true}
            animationDuration={1100}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`bar-cell-${index}`}
                fill={entry.accuracy < 60 ? 'url(#barAmberGrad)' : 'url(#barGreenGrad)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default {
  ProgressLineChart,
  TopicPieChart,
  TopicAccuracyBarChart,
};
