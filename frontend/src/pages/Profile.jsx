import React, { useState } from 'react';
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
            colors: ['#10b981', '#34d399', '#059669'],
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
        msg: err.response?.data?.message || 'Error changing password',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Candidate <span className="green-gradient-text">Profile</span>
          </h1>
          <p className="page-subtitle">
            Manage your personal details, placement target companies, resume links, and security credentials.
          </p>
        </div>
      </div>

      {/* Status Alert Banner */}
      {status.show && (
        <div
          style={{
            background: status.type === 'success' ? '#ecfdf5' : '#fff1f2',
            border: status.type === 'success' ? '1px solid #a7f3d0' : '1px solid #fecdd3',
            color: status.type === 'success' ? '#047857' : '#be123c',
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

      {/* Main Grid: Left Overview Card & Right Tab Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        {/* Left Column: Quick Profile Card */}
        <div className="metric-card" style={{ height: 'fit-content', textAlign: 'center', alignItems: 'center' }}>
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: 'var(--primary-gradient)',
              color: 'white',
              fontSize: '2rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
              marginBottom: '1rem',
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
          </div>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', marginBottom: '0.2rem' }}>
            {user?.name}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.75rem' }}>
            {user?.email}
          </p>

          <span className="badge badge-easy" style={{ marginBottom: '1.25rem' }}>
            🎯 {user?.targetCompany || 'Top Tech Companies'}
          </span>

          <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.5, marginBottom: '1.5rem', fontStyle: 'italic', textAlign: 'center' }}>
            "{user?.bio || 'Aspiring Software Engineer passionate about DSA and scalable applications.'}"
          </p>

          {/* Quick Metrics */}
          <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', padding: '1rem 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#b45309' }}>{user?.streak || 1}</span>
              <span style={{ display: 'block', fontSize: '0.7rem', color: '#6b7280' }}>Streak Days</span>
            </div>
            <div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669' }}>{user?.points || 0}</span>
              <span style={{ display: 'block', fontSize: '0.7rem', color: '#6b7280' }}>Total XP</span>
            </div>
            <div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>{user?.problemsSolved || 0}</span>
              <span style={{ display: 'block', fontSize: '0.7rem', color: '#6b7280' }}>Problems</span>
            </div>
          </div>

          {/* External Social Profiles */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            {user?.github && (
              <a
                href={user.github.startsWith('http') ? user.github : `https://${user.github}`}
                target="_blank"
                rel="noreferrer"
                className="btn-outline"
                style={{ padding: '0.45rem 0.8rem', fontSize: '0.8rem' }}
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
                style={{ padding: '0.45rem 0.8rem', fontSize: '0.8rem' }}
              >
                <Linkedin size={15} /> LinkedIn
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Tabbed Sections */}
        <div className="metric-card">
          {/* Tab Navigation */}
          <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
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
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>
                Academic & Placement Track
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ background: '#fbf9f5', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                    College / Institute
                  </span>
                  <strong style={{ fontSize: '1rem', color: '#111827', marginTop: '0.2rem', display: 'block' }}>
                    {user?.college || 'Not specified yet'}
                  </strong>
                </div>

                <div style={{ background: '#fbf9f5', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                    Graduation Year
                  </span>
                  <strong style={{ fontSize: '1rem', color: '#111827', marginTop: '0.2rem', display: 'block' }}>
                    Batch of {user?.graduationYear || 2026}
                  </strong>
                </div>

                <div style={{ background: '#fbf9f5', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                    Target Recruitment Track
                  </span>
                  <strong style={{ fontSize: '1rem', color: '#047857', marginTop: '0.2rem', display: 'block' }}>
                    {user?.targetCompany || 'Top Tech & Product'}
                  </strong>
                </div>

                <div style={{ background: '#fbf9f5', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                    Contact Phone
                  </span>
                  <strong style={{ fontSize: '1rem', color: '#111827', marginTop: '0.2rem', display: 'block' }}>
                    {user?.phone || 'Not added'}
                  </strong>
                </div>
              </div>

              {/* Skills Tags */}
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>
                Technical & Aptitude Competencies
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.75rem' }}>
                {(user?.skills && user.skills.length > 0 ? user.skills : ['DSA', 'React.js', 'Node.js', 'SQL', 'Aptitude']).map((skill, sIdx) => (
                  <span key={sIdx} className="badge badge-easy" style={{ fontSize: '0.82rem', padding: '0.3rem 0.75rem' }}>
                    &bull; {skill}
                  </span>
                ))}
              </div>

              <button onClick={() => setActiveTab('edit')} className="btn-primary">
                <Edit3 size={16} /> Edit Profile Information
              </button>
            </div>
          )}

          {/* 2. EDIT CAREER DETAILS */}
          {activeTab === 'edit' && (
            <form onSubmit={handleProfileSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
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
                  <label className="form-label">Phone Number</label>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">College / Institute</label>
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
                  <label className="form-label">Graduation Year</label>
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
                <label className="form-label">Target Company Track</label>
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
                <label className="form-label">Candidate Bio / Professional Pitch</label>
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
                <label className="form-label">Technical Skills (Comma separated)</label>
                <input
                  type="text"
                  name="skills"
                  placeholder="e.g. DSA, Dynamic Programming, Python, SQL, Aptitude"
                  value={formData.skills}
                  onChange={handleProfileChange}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">GitHub Profile URL</label>
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
                  <label className="form-label">LinkedIn Profile URL</label>
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
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111827', marginBottom: '0.4rem' }}>
                Change Account Password
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                Ensure your account is protected with a secure password containing letters, numbers, and symbols.
              </p>

              <div className="form-group">
                <label className="form-label">Current Password *</label>
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
                <label className="form-label">New Password (Min 6 chars) *</label>
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
                <label className="form-label">Confirm New Password *</label>
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
      </div>
    </div>
  );
};

export default Profile;
