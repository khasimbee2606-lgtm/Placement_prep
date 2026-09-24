import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Layers, 
  AlertCircle 
} from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errorMsg) setErrorMsg('');
  };

  const handleAutofillDemo = () => {
    setFormData({
      email: 'candidate@test.com',
      password: 'password123',
    });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorMsg('Please enter both your email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const res = await login(formData.email, formData.password);
    setLoading(false);

    if (res.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        {/* Left Side: Brand Showcase & Value Props */}
        <div className="auth-hero-panel">
          <div className="hero-pattern-overlay"></div>
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} className="sparkle-icon" />
              <span>Campus & Off-Campus Hiring 2026</span>
            </div>

            <h1 className="hero-heading">
              Turn Preparation Into Your <span className="gradient-text">Dream Offer.</span>
            </h1>

            <p className="hero-subtext">
              Track your daily DSA practice, master company-specific mock tests (TCS, Infosys, Google), and climb the leaderboard with streak-driven consistency.
            </p>

            <div className="hero-feature-list">
              <div className="hero-feature-item">
                <div className="feature-icon-box">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <strong>Live Practice Heatmap & Weak-Area Radar</strong>
                  <p>Pinpoint exactly which topics drop your test score below 60%.</p>
                </div>
              </div>

              <div className="hero-feature-item">
                <div className="feature-icon-box">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <strong>TCS / Infosys Pattern Mock Simulator</strong>
                  <p>Real-time timer, sectional timing & negative marking engine.</p>
                </div>
              </div>

              <div className="hero-feature-item">
                <div className="feature-icon-box">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <strong>Verified Placement Readiness Score</strong>
                  <p>Keep your daily streak alive and stay recruiter-ready.</p>
                </div>
              </div>
            </div>

            <div className="hero-footer-stats">
              <div className="hero-stat-card">
                <span className="hero-stat-number">500+</span>
                <span className="hero-stat-desc">Curated Questions</span>
              </div>
              <div className="hero-stat-card">
                <span className="hero-stat-number">98.4%</span>
                <span className="hero-stat-desc">Success Rate</span>
              </div>
              <div className="hero-stat-card">
                <span className="hero-stat-number">Real-time</span>
                <span className="hero-stat-desc">Socket.io Leaderboard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Login Form */}
        <div className="auth-form-panel">
          <div className="form-card">
            <div className="form-header">
              <div className="form-logo-mobile">
                <Layers className="logo-icon-small" size={24} />
                <span>PlacementPrep Pro</span>
              </div>
              <h2 className="form-title">Welcome Back</h2>
              <p className="form-subtitle">
                Enter your credentials to continue your preparation streak.
              </p>
            </div>

            {/* Quick Demo Autofill Pill */}
            <div className="demo-autofill-box">
              <div className="demo-info">
                <span className="demo-tag">Instant Test</span>
                <span className="demo-text">Want to test immediately?</span>
              </div>
              <button 
                type="button" 
                onClick={handleAutofillDemo} 
                className="btn-demo-autofill"
              >
                ⚡ Use Demo Account
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="alert-banner alert-error">
                <AlertCircle size={18} className="alert-icon" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="input-with-icon">
                  <Mail className="field-icon" size={18} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="candidate@college.edu"
                    className="form-input"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="form-group">
                <div className="label-with-action">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Please register a new test account or use the instant Demo account!'); }} className="link-muted">
                    Forgot password?
                  </a>
                </div>
                <div className="input-with-icon">
                  <Lock className="field-icon" size={18} />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="form-input pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn-eye-toggle"
                    tabIndex="-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="remember-row">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="checkbox-checkmark"></span>
                  <span className="checkbox-text">Keep me logged in on this browser</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary-large"
              >
                {loading ? (
                  <span className="btn-loading-content">
                    <span className="spinner-sm"></span>
                    Authenticating Candidate...
                  </span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight size={18} className="btn-arrow" />
                  </>
                )}
              </button>
            </form>

            {/* Switch to Register */}
            <div className="auth-form-footer">
              <p>
                Don't have a preparation account yet?{' '}
                <Link to="/register" className="link-accent">
                  Create an account
                </Link>
              </p>
            </div>

            {/* Security Badges */}
            <div className="security-note">
              <ShieldCheck size={14} className="security-icon" />
              <span>MongoDB Atlas Connected &bull; JWT Token Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
