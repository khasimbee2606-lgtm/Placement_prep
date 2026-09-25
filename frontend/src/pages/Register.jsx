import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  GraduationCap, 
  Building2, 
  Calendar, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    targetCompany: 'Google & Top Product Tech',
    graduationYear: '2026',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  // Password strength calculation
  const calculateStrength = (pwd) => {
    let score = 0;
    if (!pwd) return score;
    if (pwd.length >= 6) score += 25;
    if (pwd.length >= 10) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9!@#$%^&*]/.test(pwd)) score += 25;
    return score;
  };

  const pwdStrength = calculateStrength(formData.password);

  const getStrengthLabel = (score) => {
    if (score === 0) return { label: 'Empty', color: 'text-gray-400' };
    if (score <= 25) return { label: 'Weak (min 6 chars)', color: 'strength-weak' };
    if (score <= 50) return { label: 'Fair (add capital/digit)', color: 'strength-fair' };
    if (score <= 75) return { label: 'Good (secure)', color: 'strength-good' };
    return { label: 'Strong (excellent)', color: 'strength-strong' };
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      setErrorMsg('Please fill in your name, email, and password.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-check.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const res = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      college: formData.college,
      targetCompany: formData.targetCompany,
      graduationYear: Number(formData.graduationYear),
    });

    setLoading(false);

    if (res.success) {
      // Trigger festive confetti animation
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
        });
      } catch (err) {
        // Confetti is decorative
      }

      setSuccessMsg('Account created successfully! Redirecting to your dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container register-layout">
        {/* Left Side: Motivational Sidebar */}
        <div className="auth-hero-panel register-hero">
          <div className="hero-pattern-overlay"></div>
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} className="sparkle-icon" />
              <span>Free Candidate Membership</span>
            </div>

            <h1 className="hero-heading">
              Start Your Journey To <span className="gradient-text">Day-1 Placement.</span>
            </h1>

            <p className="hero-subtext">
              Join thousands of engineering and MCA students systematically preparing for campus drives and off-campus tech recruitment.
            </p>

            <div className="candidate-perks">
              <div className="perk-card">
                <div className="perk-header">
                  <span className="perk-step">01</span>
                  <h4>50 Welcome Points (XP)</h4>
                </div>
                <p>Instant points added to kickstart your leaderboard journey.</p>
              </div>

              <div className="perk-card">
                <div className="perk-header">
                  <span className="perk-step">02</span>
                  <h4>TCS & Infosys Mock Engine</h4>
                </div>
                <p>Real assessment experience with timed sections and automated evaluation.</p>
              </div>

              <div className="perk-card">
                <div className="perk-header">
                  <span className="perk-step">03</span>
                  <h4>Smart Topic Diagnostics</h4>
                </div>
                <p>Automatic detection of topics below 60% accuracy for targeted revision.</p>
              </div>
            </div>

            <div className="quote-box">
              <p className="quote-text">
                "Consistent tracking of DSA and speed-aptitude is the #1 differentiator between getting placed and getting screened out."
              </p>
              <span className="quote-author">&mdash; Campus Placement Cell Advisory</span>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="auth-form-panel">
          <div className="form-card">
            <div className="form-header">
              <div className="form-logo-mobile">
                <Layers className="logo-icon-small" size={24} />
                <span>Campus2Career</span>
              </div>
              <h2 className="form-title">Create Candidate Account</h2>
              <p className="form-subtitle">
                Set up your personal profile to track preparation progress.
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="alert-banner alert-error">
                <AlertCircle size={18} className="alert-icon" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="alert-banner alert-success">
                <CheckCircle2 size={18} className="alert-icon" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name <span className="text-required">*</span>
                </label>
                <div className="input-with-icon">
                  <User className="field-icon" size={18} />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe / Priya Sharma"
                    className="form-input"
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address <span className="text-required">*</span>
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
                    placeholder="e.g. candidate@gmail.com"
                    className="form-input"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Grid: College & Target Company */}
              <div className="form-row-grid">
                <div className="form-group">
                  <label htmlFor="college" className="form-label">
                    College / Institute
                  </label>
                  <div className="input-with-icon">
                    <GraduationCap className="field-icon" size={18} />
                    <input
                      id="college"
                      name="college"
                      type="text"
                      value={formData.college}
                      onChange={handleChange}
                      placeholder="e.g. State Tech Institute"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="graduationYear" className="form-label">
                    Graduation Year
                  </label>
                  <div className="input-with-icon">
                    <Calendar className="field-icon" size={18} />
                    <select
                      id="graduationYear"
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleChange}
                      className="form-input form-select"
                    >
                      <option value="2024">2024 (Immediate)</option>
                      <option value="2025">2025 (Final Year)</option>
                      <option value="2026">2026 (Batch of 2026)</option>
                      <option value="2027">2027 (Pre-final)</option>
                      <option value="2028">2028 (Sophomore)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Target Company Track */}
              <div className="form-group">
                <label htmlFor="targetCompany" className="form-label">
                  Target Company / Track
                </label>
                <div className="input-with-icon">
                  <Building2 className="field-icon" size={18} />
                  <select
                    id="targetCompany"
                    name="targetCompany"
                    value={formData.targetCompany}
                    onChange={handleChange}
                    className="form-input form-select"
                  >
                    <option value="Google & Top Product Tech">Google, Microsoft, Amazon (Product Tier 1)</option>
                    <option value="TCS Digital & Ninja">TCS Digital / Ninja / NQT</option>
                    <option value="Infosys Specialist Programmer">Infosys (DSE / SP Track)</option>
                    <option value="Wipro / Accenture / Capgemini">Wipro / Accenture / Capgemini</option>
                    <option value="FinTech & Banking (Goldman/Morgan)">FinTech & Banking (Goldman Sachs / Morgan Stanley)</option>
                    <option value="High-Growth Tech Startups">High-Growth Tech Startups</option>
                  </select>
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Create Password <span className="text-required">*</span>
                </label>
                <div className="input-with-icon">
                  <Lock className="field-icon" size={18} />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    className="form-input pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn-eye-toggle"
                    tabIndex="-1"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {formData.password && (
                  <div className="password-strength-container">
                    <div className="strength-bar-bg">
                      <div 
                        className={`strength-bar-fill strength-level-${pwdStrength}`} 
                        style={{ width: `${pwdStrength}%` }}
                      ></div>
                    </div>
                    <span className="strength-text">
                      Strength: <strong>{getStrengthLabel(pwdStrength).label}</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password <span className="text-required">*</span>
                </label>
                <div className="input-with-icon">
                  <Lock className="field-icon" size={18} />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    className="form-input pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="btn-eye-toggle"
                    tabIndex="-1"
                    aria-label="Toggle password visibility"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Terms checkbox */}
              <div className="remember-row">
                <label className="checkbox-container">
                  <input type="checkbox" required defaultChecked />
                  <span className="checkbox-checkmark"></span>
                  <span className="checkbox-text">
                    I agree to the Placement Preparation community guidelines and tracking terms
                  </span>
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
                    Registering Candidate Profile...
                  </span>
                ) : (
                  <>
                    <span>Create Free Account & Claim 50 XP</span>
                    <ArrowRight size={18} className="btn-arrow" />
                  </>
                )}
              </button>
            </form>

            {/* Switch to Login */}
            <div className="auth-form-footer">
              <p>
                Already have a preparation account?{' '}
                <Link to="/login" className="link-accent">
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Security Notice */}
            <div className="security-note">
              <ShieldCheck size={14} className="security-icon" />
              <span>MongoDB Atlas Connected &bull; Instant Password Hashing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
