import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Award,
  Zap,
  Target,
  BarChart3,
  Layers,
  GraduationCap,
  Play,
  Flame,
  Code,
  ShieldCheck,
  Compass
} from 'lucide-react';

const Launch = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [demoLoading, setDemoLoading] = useState(false);

  const handleInstantDemo = async () => {
    setDemoLoading(true);
    try {
      const res = await login('candidate@test.com', 'password123');
      if (res.success) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } catch {
      navigate('/login');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="launch-page-wrapper">
      {/* Subtle Ambient Background Gradients */}
      <div className="launch-ambient-glow top-left"></div>
      <div className="launch-ambient-glow bottom-right"></div>

      {/* Top Navbar */}
      <header className="launch-navbar">
        <div className="launch-nav-inner">
          <Link to="/launch" className="launch-nav-brand">
            <img src="/logo.png" alt="Campus 2 Career Logo" className="launch-nav-logo" />
            <div className="launch-nav-brand-text">
              <span className="launch-nav-title">Campus <span className="text-emerald">2</span> Career</span>
              <span className="launch-nav-sub">Track &bull; Analyze &bull; Achieve</span>
            </div>
          </Link>

          <div className="launch-nav-actions">
            <Link to="/" className="launch-nav-link">
              Full Platform Tour
            </Link>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary-launch">
                <span>Go to Dashboard</span>
                <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <button 
                  onClick={handleInstantDemo} 
                  disabled={demoLoading}
                  className="btn-launch-demo"
                  title="Test immediately with demo candidate profile"
                >
                  <Sparkles size={15} />
                  <span>{demoLoading ? 'Logging In...' : 'Instant Demo'}</span>
                </button>
                <Link to="/login" className="btn-primary-launch">
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Launch Showcase */}
      <main className="launch-main-container">
        {/* Hero Logo & Main Caption */}
        <section className="launch-hero-section">
          <div className="launch-badge">
            <Sparkles size={14} className="launch-badge-icon" />
            <span>Campus Recruitment & Placement Acceleration Suite</span>
          </div>

          {/* Prominent Uploaded Logo Showcase */}
          <div className="launch-logo-card">
            <img 
              src="/logo.png" 
              alt="Campus 2 Career - Track, Analyze, Achieve" 
              className="launch-main-logo"
            />
            <div className="launch-logo-halo"></div>
          </div>

          <h1 className="launch-title">
            Campus <span className="text-emerald">2</span> Career
          </h1>
          <p className="launch-tagline">
            Prepare Smarter &bull; Get Hired Faster
          </p>

          <p className="launch-lead-caption">
            Your end-to-end placement intelligence platform designed to turn engineering graduates
            into top-tier corporate offers. Solve curated DSA, master company-pattern mock assessments,
            and eliminate weak areas with automated visual analytics.
          </p>

          {/* Primary Action Group - Directs to Login */}
          <div className="launch-action-group">
            <Link to="/login" className="btn-launch-get-started cta-glow" id="launch-get-started-btn">
              <span>Get Started</span>
              <ArrowRight size={20} />
            </Link>

            <button 
              onClick={handleInstantDemo} 
              disabled={demoLoading}
              className="btn-launch-instant-demo"
            >
              <Zap size={18} />
              <span>{demoLoading ? 'Launching Demo...' : '1-Click Live Demo'}</span>
            </button>

            <Link to="/register" className="btn-launch-register">
              <span>Create Account</span>
            </Link>
          </div>

          <p className="launch-guarantee-note">
            ✓ 100% Free Forever for Students &bull; No Credit Card Required &bull; Ready in Browser
          </p>
        </section>

        {/* The 3 Core Pillars: Track • Analyze • Achieve */}
        <section className="launch-pillars-section">
          <div className="pillars-grid">
            {/* Pillar 1: Track */}
            <div className="pillar-card">
              <div className="pillar-icon-box">
                <Target size={28} color="#10b981" />
              </div>
              <div className="pillar-badge">Pillar 01</div>
              <h3 className="pillar-title">TRACK</h3>
              <p className="pillar-caption">
                <strong>Every problem logged, every concept mastered.</strong> Build consistent habits
                with a multi-domain tracker covering DSA, Quantitative Aptitude, and SQL.
              </p>
              <ul className="pillar-list">
                <li><CheckCircle2 size={16} color="#10b981" /> <span>500+ Curated interview problems with solutions</span></li>
                <li><CheckCircle2 size={16} color="#10b981" /> <span>Difficulty weights, solve timers & revision notes</span></li>
                <li><CheckCircle2 size={16} color="#10b981" /> <span>52-Week GitHub-style green activity heatmap</span></li>
              </ul>
            </div>

            {/* Pillar 2: Analyze */}
            <div className="pillar-card highlight">
              <div className="pillar-icon-box">
                <BarChart3 size={28} color="#059669" />
              </div>
              <div className="pillar-badge emerald">Pillar 02 &bull; Core Engine</div>
              <h3 className="pillar-title">ANALYZE</h3>
              <p className="pillar-caption">
                <strong>Zero guesswork in your preparation.</strong> Automated algorithms pinpoint
                topics where your score drops below the 60% drive selection cut-off.
              </p>
              <ul className="pillar-list">
                <li><CheckCircle2 size={16} color="#10b981" /> <span>Automated &lt;60% accuracy weak-area cut-off radar</span></li>
                <li><CheckCircle2 size={16} color="#10b981" /> <span>Dynamic Interview Readiness Index gauge</span></li>
                <li><CheckCircle2 size={16} color="#10b981" /> <span>Targeted remedial problem suggestions</span></li>
              </ul>
            </div>

            {/* Pillar 3: Achieve */}
            <div className="pillar-card">
              <div className="pillar-icon-box">
                <Award size={28} color="#10b981" />
              </div>
              <div className="pillar-badge">Pillar 03</div>
              <h3 className="pillar-title">ACHIEVE</h3>
              <p className="pillar-caption">
                <strong>Pressure simulation for day-1 selection.</strong> Practice under actual hiring
                conditions with company-specific timers and live peer rankings.
              </p>
              <ul className="pillar-list">
                <li><CheckCircle2 size={16} color="#10b981" /> <span>TCS NQT & Infosys Springboard mock test engine</span></li>
                <li><CheckCircle2 size={16} color="#10b981" /> <span>Active countdown timer with negative marking (-0.25)</span></li>
                <li><CheckCircle2 size={16} color="#10b981" /> <span>Real-time Socket.io nationwide leaderboard</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Captions & Highlights Banner */}
        <section className="launch-callout-banner">
          <div className="callout-content">
            <span className="callout-tag">Day-1 Hiring Standard</span>
            <h2 className="callout-title">
              Designed For Every Campus & Off-Campus Drive
            </h2>
            <p className="callout-text">
              Whether you are preparing for Mass Recruiters (TCS, Infosys, Cognizant, Wipro)
              or Product Giants (Google, Amazon, Microsoft), Campus 2 Career provides the exact
              structured roadmap to verify your readiness before the interviewers arrive.
            </p>
            <div className="callout-stats">
              <div className="c-stat">
                <span className="c-num">50k+</span>
                <span className="c-lbl">Problems Solved</span>
              </div>
              <div className="c-stat">
                <span className="c-num">98.4%</span>
                <span className="c-lbl">Placement Success</span>
              </div>
              <div className="c-stat">
                <span className="c-num">Real-Time</span>
                <span className="c-lbl">Socket.io Telemetry</span>
              </div>
            </div>
            <div className="callout-action">
              <Link to="/login" className="btn-launch-get-started large">
                <span>Direct Access to Login</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="launch-footer">
        <div className="launch-footer-inner">
          <div className="footer-left">
            <img src="/logo.png" alt="Campus 2 Career" className="footer-logo-img" />
            <div>
              <p className="footer-brand-title">Campus 2 Career</p>
              <p className="footer-tagline">Track &bull; Analyze &bull; Achieve</p>
            </div>
          </div>
          <div className="footer-links">
            <Link to="/login">Sign In</Link>
            <Link to="/register">Create Account</Link>
            <Link to="/">Full Platform Tour</Link>
          </div>
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} Campus 2 Career. Placement Preparation Platform.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Launch;
