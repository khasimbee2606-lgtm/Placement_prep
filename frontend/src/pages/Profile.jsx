import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  User,
  Mail,
  GraduationCap,
  Briefcase,
  Calendar,
  Phone,
  Github,
  Linkedin,
  Flame,
  Award,
  Code2,
  Lock,
  Save,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Edit3
} from 'lucide-react';
import confetti from 'canvas-confetti';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'edit' | 'security'
  const [heatmapData, setHeatmapData] = useState([]);
  const [hoveredCell, setHoveredCell] = useState(null);

  // Edit Profile Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    targetCompany: user?.targetCompany || 'Top Tech & Product Companies',
    graduationYear: user?.graduationYear || 2026,
    bio: user?.bio || 'Aspiring Software Engineer passionate about DSA, problem solving, and building scalable full-stack applications.',
    skills: user?.skills ? user.skills.join(', ') : 'DSA, React, Node.js, SQL, Aptitude',
    github: user?.github || '',
    linkedin: user?.linkedin || '',
    phone: user?.phone || '',
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ show: false, msg: '', type: 'success' });

  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        const res = await API.get('/practice/heatmap');
        if (res.data.success) {
          setHeatmapData(res.data.heatmap || []);
        }
      } catch (err) {
        console.error('Error fetching heatmap on profile:', err);
      }
    };
    fetchHeatmap();
  }, []);

  const handleProfileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ show: false, msg: '', type: 'success' });

    try {
      const skillsArray = formData.skills.split(',').map((s) => s.trim()).filter(Boolean);

      const res = await API.put('/auth/profile', {
        ...formData,
        skills: skillsArray,
      });

      if (res.data.success) {
        updateUser(res.data.user);
        setStatus({
          show: true,
          msg: 'Profile details updated successfully!',
          type: 'success',
        });
        setActiveTab('details');

        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#16A34A', '#22C55E', '#065F46'],
          });
        } catch {}
      }
    } catch (err) {
      setStatus({
        show: true,
        msg: err.response?.data?.message || 'Error updating profile',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword.length < 6) {
      setStatus({ show: true, msg: 'New password must be at least 6 characters long.', type: 'error' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setStatus({ show: true, msg: 'New passwords do not match.', type: 'error' });
      return;
    }

    setLoading(true);
    setStatus({ show: false, msg: '', type: 'success' });

    try {
      const res = await API.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (res.data.success) {
        setStatus({
          show: true,
          msg: 'Password updated successfully!',
          type: 'success',
        });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setStatus({
        show: true,
        msg: err.response?.data?.message || 'Error updating password',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate GitHub-style 52-week activity calendar cells (recent 119 days)
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

  return (
    <div className="page-transition">
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '1.75rem' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1F2937' }}>
            Candidate <span style={{ color: '#16A34A' }}>Profile</span>
          </h1>
          <p className="page-subtitle" style={{ fontSize: '0.88rem', color: '#6B7280' }}>
            Manage your personal profile, target placement company track, activity heatmap, and credentials.
          </p>
        </div>
      </div>

      {/* Status Alert Banner */}
      {status.show && (
        <div
          style={{
            background: status.type === 'success' ? '#DCFCE7' : '#FEE2E2',
            border: status.type === 'success' ? '1px solid #16A34A' : '1px solid #DC2626',
            color: status.type === 'success' ? '#065F46' : '#991B1B',
            borderRadius: '10px',
            padding: '0.85rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{status.msg}</span>
        </div>
      )}

      {/* Main Grid: Left Overview Card & Right Content */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Column: Quick Profile Card */}
        <div className="metric-card" style={{ textAlign: 'center', alignItems: 'center', padding: '2rem 1.5rem' }}>
          <div
            style={{
              width: '88px',
              height: '88px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #16A34A 0%, #065F46 100%)',
              color: 'white',
              fontSize: '2.2rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(22, 163, 74, 0.35)',
              marginBottom: '1rem',
              border: '3px solid #DCFCE7',
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
          </div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1F2937', marginBottom: '0.2rem' }}>
            {user?.name}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '0.75rem' }}>
            {user?.email}
          </p>

          <span style={{ fontSize: '0.8rem', fontWeight: 700, background: '#DCFCE7', color: '#16A34A', padding: '0.25rem 0.75rem', borderRadius: '999px', marginBottom: '1.25rem' }}>
            🎯 {user?.targetCompany || 'Top Tech Companies'}
          </span>

          <p style={{ fontSize: '0.85rem', color: '#4B5563', lineHeight: 1.55, marginBottom: '1.5rem', fontStyle: 'italic' }}>
            "{user?.bio || 'Aspiring Software Engineer passionate about DSA, problem solving, and building scalable applications.'}"
          </p>

          {/* Quick Metrics */}
          <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', padding: '1rem 0', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB', marginBottom: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#B45309' }}>{user?.streak || 1}</span>
              <span style={{ display: 'block', fontSize: '0.72rem', color: '#6B7280', fontWeight: 600 }}>Streak Days</span>
            </div>
            <div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#16A34A' }}>{user?.points || 0}</span>
              <span style={{ display: 'block', fontSize: '0.72rem', color: '#6B7280', fontWeight: 600 }}>Total XP</span>
            </div>
            <div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1F2937' }}>{user?.problemsSolved || 0}</span>
              <span style={{ display: 'block', fontSize: '0.72rem', color: '#6B7280', fontWeight: 600 }}>Problems</span>
            </div>
          </div>

          {/* Social Profiles */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            {user?.github && (
              <a
                href={user.github.startsWith('http') ? user.github : `https://${user.github}`}
                target="_blank"
                rel="noreferrer"
                className="btn-outline"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
              >
                <Github size={15} /> GitHub
              </a>
            )}
            {user?.linkedin && (
              <a
                href={user.linkedin.startsWith('http') ? user.linkedin : `https://${user.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="btn-outline"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
              >
                <Linkedin size={15} /> LinkedIn
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Tabbed Sections & Activity Heatmap */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="metric-card" style={{ padding: '1.75rem' }}>
            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveTab('details')}
                className={activeTab === 'details' ? 'btn-primary' : 'btn-outline'}
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                <User size={15} /> Overview & Portfolio
              </button>
              <button
                onClick={() => setActiveTab('edit')}
                className={activeTab === 'edit' ? 'btn-primary' : 'btn-outline'}
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                <Edit3 size={15} /> Edit Career Details
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={activeTab === 'security' ? 'btn-primary' : 'btn-outline'}
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                <Lock size={15} /> Security & Password
              </button>
            </div>

            {/* 1. OVERVIEW & PORTFOLIO */}
            {activeTab === 'details' && (
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1F2937', marginBottom: '1.25rem' }}>
                  Academic & Placement Track
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: '#F8F6F1', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '1rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                      College / Institute
                    </span>
                    <strong style={{ fontSize: '0.95rem', color: '#1F2937', marginTop: '0.2rem', display: 'block' }}>
                      {user?.college || 'Not specified'}
                    </strong>
                  </div>

                  <div style={{ background: '#F8F6F1', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '1rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                      Graduation Year
                    </span>
                    <strong style={{ fontSize: '0.95rem', color: '#1F2937', marginTop: '0.2rem', display: 'block' }}>
                      Batch of {user?.graduationYear || 2026}
                    </strong>
                  </div>

                  <div style={{ background: '#F8F6F1', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '1rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                      Target Track
                    </span>
                    <strong style={{ fontSize: '0.95rem', color: '#16A34A', marginTop: '0.2rem', display: 'block' }}>
                      {user?.targetCompany || 'Top Tech & Product'}
                    </strong>
                  </div>

                  <div style={{ background: '#F8F6F1', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '1rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                      Contact Phone
                    </span>
                    <strong style={{ fontSize: '0.95rem', color: '#1F2937', marginTop: '0.2rem', display: 'block' }}>
                      {user?.phone || 'Not added'}
                    </strong>
                  </div>
                </div>

                {/* Skills Tags */}
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1F2937', marginBottom: '0.65rem' }}>
                  Technical Competencies & Skills
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {(user?.skills && user.skills.length > 0 ? user.skills : ['DSA', 'React.js', 'Node.js', 'SQL', 'Aptitude']).map((skill, sIdx) => (
                    <span key={sIdx} style={{ fontSize: '0.8rem', fontWeight: 600, background: '#DCFCE7', color: '#16A34A', padding: '0.25rem 0.75rem', borderRadius: '999px' }}>
                      &bull; {skill}
                    </span>
                  ))}
                </div>

                <button onClick={() => setActiveTab('edit')} className="btn-secondary" style={{ padding: '0.55rem 1rem' }}>
                  <Edit3 size={15} /> Edit Career Details
                </button>
              </div>
            )}

            {/* 2. EDIT CAREER DETAILS */}
            {activeTab === 'edit' && (
              <form onSubmit={handleProfileSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ color: '#374151' }}>Full Name *</label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleProfileChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ color: '#374151' }}>Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={handleProfileChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ color: '#374151' }}>College / Institute</label>
                    <input
                      type="text"
                      name="college"
                      placeholder="e.g. State Institute of Technology"
                      value={formData.college}
                      onChange={handleProfileChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ color: '#374151' }}>Graduation Year</label>
                    <select
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleProfileChange}
                      className="form-select"
                    >
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026 (Batch of 2026)</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#374151' }}>Target Company Track</label>
                  <input
                    type="text"
                    name="targetCompany"
                    placeholder="e.g. Google, TCS Digital, Infosys SP, Amazon"
                    value={formData.targetCompany}
                    onChange={handleProfileChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#374151' }}>Candidate Bio / Pitch</label>
                  <textarea
                    rows="3"
                    name="bio"
                    placeholder="Share a short summary about your goals and technical interests..."
                    value={formData.bio}
                    onChange={handleProfileChange}
                    className="form-textarea"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#374151' }}>Technical Skills (Comma separated)</label>
                  <input
                    type="text"
                    name="skills"
                    placeholder="e.g. DSA, Dynamic Programming, Python, SQL, Aptitude"
                    value={formData.skills}
                    onChange={handleProfileChange}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ color: '#374151' }}>GitHub Profile URL</label>
                    <input
                      type="text"
                      name="github"
                      placeholder="https://github.com/username"
                      value={formData.github}
                      onChange={handleProfileChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ color: '#374151' }}>LinkedIn Profile URL</label>
                    <input
                      type="text"
                      name="linkedin"
                      placeholder="https://linkedin.com/in/username"
                      value={formData.linkedin}
                      onChange={handleProfileChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                  <button type="button" onClick={() => setActiveTab('details')} className="btn-outline">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="btn-primary">
                    <Save size={16} /> {loading ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            )}

            {/* 3. SECURITY & PASSWORD */}
            {activeTab === 'security' && (
              <form onSubmit={handlePasswordSubmit} style={{ maxWidth: '480px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1F2937', marginBottom: '0.4rem' }}>
                  Change Account Password
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '1.5rem' }}>
                  Ensure your account is protected with a secure password containing letters and numbers.
                </p>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#374151' }}>Current Password *</label>
                  <input
                    type="password"
                    required
                    name="currentPassword"
                    placeholder="••••••••"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#374151' }}>New Password (Min 6 chars) *</label>
                  <input
                    type="password"
                    required
                    name="newPassword"
                    placeholder="••••••••"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#374151' }}>Confirm New Password *</label>
                  <input
                    type="password"
                    required
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="form-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ marginTop: '1rem' }}
                >
                  <ShieldCheck size={16} /> {loading ? 'Updating Password...' : 'Update Password'}
                </button>
              </form>
            )}
          </div>

          {/* GitHub-Style 52-Week Activity Heatmap on Profile */}
          <div className="heatmap-card" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div className="heatmap-header" style={{ marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1F2937', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles size={16} style={{ color: '#16A34A' }} /> Candidate 52-Week Practice Heatmap
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                  Continuous record of daily practice challenges and mock test completions.
                </p>
              </div>
              {hoveredCell && (
                <span style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 600 }}>
                  {hoveredCell.date}: {hoveredCell.count} problem(s)
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

            <div className="heatmap-legend" style={{ color: '#6B7280', marginTop: '0.75rem' }}>
              <span>Less</span>
              <div className="heatmap-cell" />
              <div className="heatmap-cell level-1" />
              <div className="heatmap-cell level-2" />
              <div className="heatmap-cell level-3" />
              <div className="heatmap-cell level-4" />
              <span>More Activity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
