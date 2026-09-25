import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InteractiveMeshCanvas from '../components/InteractiveMeshCanvas';
import {
  Sparkles,
  ArrowRight,
  Code,
  Clock,
  TrendingUp,
  Award,
  ShieldCheck,
  CheckCircle,
  Play,
  Users,
  Target,
  ChevronRight,
  GraduationCap,
  Terminal,
  Activity,
  Zap,
  BarChart3,
  Flame,
  Layers,
  Compass,
  Star,
} from 'lucide-react';

const Landing = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [demoLoading, setDemoLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dsa');

  // One-click demo login straight from the landing page
  const handleDemoLogin = async () => {
    setDemoLoading(true);
    try {
      const res = await login('candidate@test.com', 'password123');
      if (res.success) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } catch (err) {
      navigate('/login');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="landing-wrapper">
      {/* =========================================================================
          TOP NAVIGATION BAR (Glassmorphism + Emerald Accents)
          ========================================================================= */}
      <header className="landing-navbar">
        <div className="landing-nav-container">
          <Link to="/" className="landing-logo">
            <div className="landing-logo-icon">
              <GraduationCap size={22} color="#ffffff" />
            </div>
            <div className="landing-logo-text">
              <span className="landing-brand-name">Campus<span className="landing-brand-green">2</span>Career</span>
              <span className="landing-brand-tag">Placement Accelerator</span>
            </div>
          </Link>

          <nav className="landing-nav-links">
            <a href="#features" className="landing-nav-link">Features</a>
            <a href="#modules" className="landing-nav-link">Modules</a>
            <a href="#roadmap" className="landing-nav-link">Roadmap</a>
            <a href="#stats" className="landing-nav-link">Impact</a>
            <a href="#testimonials" className="landing-nav-link">Stories</a>
          </nav>

          <div className="landing-nav-actions">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary landing-cta-btn">
                <span>Go to Dashboard</span>
                <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <button
                  onClick={handleDemoLogin}
                  disabled={demoLoading}
                  className="landing-demo-btn"
                  title="Instant access with preloaded data"
                >
                  <Sparkles size={15} />
                  <span>{demoLoading ? 'Logging In...' : 'Instant Demo'}</span>
                </button>
                <Link to="/login" className="landing-login-btn">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary landing-cta-btn">
                  <span>Get Started</span>
                  <ArrowRight size={16} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================================
          HERO SECTION (Interactive 3D Net Canvas + Dynamic Visuals)
          ========================================================================= */}
      <section className="landing-hero-section">
        {/* Dynamic Canvas Background (Vanta/ThreeJS net physics) */}
        <InteractiveMeshCanvas />

        <div className="landing-hero-container">
          {/* Animated Announcement Pill */}
          <div className="landing-pill">
            <span className="landing-pill-pulse"></span>
            <Sparkles size={14} className="landing-pill-icon" />
            <span>Next-Gen Placement Preparation Intelligence</span>
            <span className="landing-pill-badge">v2.0</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="landing-hero-title">
            From Campus Classrooms to{' '}
            <span className="landing-gradient-text">Top-Tier Tech Offers</span>
          </h1>

          {/* Subtitle */}
          <p className="landing-hero-subtitle">
            The definitive engineering placement platform. Master curated DSA, Aptitude & SQL,
            simulate real-time timed mock tests with company negative marking, and eliminate weak
            areas with precision analytics.
          </p>

          {/* Hero Action Buttons */}
          <div className="landing-hero-actions">
            <Link to="/register" className="landing-btn-hero-primary">
              <Zap size={18} />
              <span>Start Preparing Free</span>
              <ArrowRight size={18} />
            </Link>

            <button
              onClick={handleDemoLogin}
              disabled={demoLoading}
              className="landing-btn-hero-secondary"
            >
              <Play size={17} fill="#10b981" color="#10b981" />
              <span>{demoLoading ? 'Entering Demo...' : 'Explore Live Demo'}</span>
            </button>
          </div>

          {/* Interactive Live Platform Preview Card */}
          <div className="landing-preview-card-wrapper">
            <div className="landing-preview-card">
              <div className="preview-card-header">
                <div className="preview-dots">
                  <span className="p-dot red"></span>
                  <span className="p-dot yellow"></span>
                  <span className="p-dot green"></span>
                </div>
                <div className="preview-search-bar">
                  <Terminal size={13} color="#10b981" />
                  <span>campus2career.app/dashboard • live candidate telemetry</span>
                </div>
                <div className="preview-status-badge">
                  <span className="live-indicator"></span>
                  <span>Socket.io Synchronized</span>
                </div>
              </div>

              {/* Inside Live Preview Card */}
              <div className="preview-grid">
                {/* Solved Stats Pill */}
                <div className="preview-stat-card">
                  <div className="p-stat-header">
                    <span className="p-stat-label">Problems Solved</span>
                    <Flame size={18} color="#10b981" />
                  </div>
                  <div className="p-stat-value">248 <span className="p-stat-sub">/ 350 Target</span></div>
                  <div className="p-progress-track">
                    <div className="p-progress-fill" style={{ width: '71%' }}></div>
                  </div>
                  <div className="p-stat-tags">
                    <span className="tag-pill easy">78 Easy</span>
                    <span className="tag-pill medium">134 Medium</span>
                    <span className="tag-pill hard">36 Hard</span>
                  </div>
                </div>

                {/* Readiness Index */}
                <div className="preview-stat-card highlight">
                  <div className="p-stat-header">
                    <span className="p-stat-label">Interview Readiness</span>
                    <Award size={18} color="#059669" />
                  </div>
                  <div className="p-stat-value green">88.5%</div>
                  <div className="p-readiness-indicator">
                    <span className="readiness-dot"></span>
                    <span>High Placement Probability</span>
                  </div>
                  <div className="p-stat-footer">
                    <span>Target: <strong>Google, Amazon, TCS Digital</strong></span>
                  </div>
                </div>

                {/* Weak Area Detection */}
                <div className="preview-stat-card">
                  <div className="p-stat-header">
                    <span className="p-stat-label">AI Weakness Alert</span>
                    <TrendingUp size={18} color="#d97706" />
                  </div>
                  <div className="weak-alert-box">
                    <div className="weak-topic-title">Dynamic Programming</div>
                    <div className="weak-score-bar">
                      <span className="weak-score-text">42% Accuracy (Cut-off: 60%)</span>
                      <div className="p-progress-track">
                        <div className="p-progress-fill alert" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="p-action-prompt">
                    <ChevronRight size={14} color="#10b981" />
                    <span>3 Recovery Problems Suggested</span>
                  </div>
                </div>
              </div>

              {/* Live Heatmap Preview Strip */}
              <div className="preview-heatmap-strip">
                <div className="p-heatmap-header">
                  <span>Continuous 52-Week Practice Heatmap</span>
                  <span className="p-streak-badge">🔥 18 Day Current Streak</span>
                </div>
                <div className="p-heatmap-cells">
                  {Array.from({ length: 42 }).map((_, i) => {
                    const intensities = ['level-0', 'level-1', 'level-2', 'level-3', 'level-4'];
                    const chosen =
                      i > 30 ? intensities[3] :
                      i > 20 ? intensities[2] :
                      i % 3 === 0 ? intensities[1] :
                      i % 7 === 0 ? intensities[4] : intensities[0];
                    return <div key={i} className={`p-cell ${chosen}`}></div>;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURE METRICS / IMPACT BANNER
          ========================================================================= */}
      <section className="landing-stats-section" id="stats">
        <div className="landing-stats-container">
          <div className="stat-counter-block">
            <span className="stat-number">50,000+</span>
            <span className="stat-label">Coding & Aptitude Questions Solved</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-counter-block">
            <span className="stat-number">98.7%</span>
            <span className="stat-label">Interview Clearance Rate</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-counter-block">
            <span className="stat-number">&lt; 60%</span>
            <span className="stat-label">Automated Weak Area Cut-off Radar</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-counter-block">
            <span className="stat-number">Real-Time</span>
            <span className="stat-label">Socket.io Leaderboard Sync</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MODULES SECTION (The 6 Pillars of Campus2Career)
          ========================================================================= */}
      <section className="landing-modules-section" id="modules">
        <div className="landing-section-header">
          <div className="landing-pill sub">
            <Layers size={13} color="#10b981" />
            <span>Integrated Preparation Architecture</span>
          </div>
          <h2 className="landing-section-title">
            Everything You Need to <span className="landing-gradient-text">Crack Any Drive</span>
          </h2>
          <p className="landing-section-subtitle">
            From technical coding rounds to cognitive aptitude screenings and resume profiling,
            Campus2Career covers every phase of campus recruitment.
          </p>
        </div>

        <div className="modules-grid">
          {/* Module 1: Practice Tracker */}
          <div className="module-card">
            <div className="module-icon-wrap">
              <Code size={24} color="#10b981" />
            </div>
            <h3 className="module-title">Multi-Domain Practice Tracker</h3>
            <p className="module-desc">
              Log and track problems across Data Structures, Algorithms, Quantitative Aptitude,
              and SQL. Filter by difficulty, time spent, and company tags.
            </p>
            <ul className="module-features-list">
              <li><CheckCircle size={15} color="#10b981" /> <span>Curated question bank with solutions</span></li>
              <li><CheckCircle size={15} color="#10b981" /> <span>Difficulty weights & XP calculations</span></li>
              <li><CheckCircle size={15} color="#10b981" /> <span>Revision tags & personal solution notes</span></li>
            </ul>
          </div>

          {/* Module 2: Mock Tests */}
          <div className="module-card featured">
            <div className="module-card-badge">Most Popular</div>
            <div className="module-icon-wrap">
              <Clock size={24} color="#059669" />
            </div>
            <h3 className="module-title">Timed Mock Test Simulator</h3>
            <p className="module-desc">
              Practice under real hiring pressure. Exact patterns modeled after TCS NQT,
              Infosys Springboard, Wipro, and Cognizant with active countdown clocks.
            </p>
            <ul className="module-features-list">
              <li><CheckCircle size={15} color="#10b981" /> <span>TCS & Infosys negative marking (-0.25)</span></li>
              <li><CheckCircle size={15} color="#10b981" /> <span>Auto-submission on timer expiration</span></li>
              <li><CheckCircle size={15} color="#10b981" /> <span>Instant scorecards with explanations</span></li>
            </ul>
          </div>

          {/* Module 3: Weak-Area Radar */}
          <div className="module-card">
            <div className="module-icon-wrap">
              <TrendingUp size={24} color="#10b981" />
            </div>
            <h3 className="module-title">Weak-Area Intelligence Engine</h3>
            <p className="module-desc">
              Never fail the same topic twice. Automated algorithms flag subjects where
              accuracy dips below 60%, providing immediate remedial questions.
            </p>
            <ul className="module-features-list">
              <li><CheckCircle size={15} color="#10b981" /> <span>Topic accuracy breakdown with cut-off line</span></li>
              <li><CheckCircle size={15} color="#10b981" /> <span>Interview Readiness Index calculation</span></li>
              <li><CheckCircle size={15} color="#10b981" /> <span>Velocity curves & solve speed metrics</span></li>
            </ul>
          </div>

          {/* Module 4: Heatmap & Consistency */}
          <div className="module-card">
            <div className="module-icon-wrap">
              <Activity size={24} color="#10b981" />
            </div>
            <h3 className="module-title">52-Week Activity Heatmap</h3>
            <p className="module-desc">
              Visualize your daily consistency with a GitHub-style activity grid.
              Build unbroken streaks that prove your dedication to recruiters.
            </p>
            <ul className="module-features-list">
              <li><CheckCircle size={15} color="#10b981" /> <span>Interactive hover tooltip with solve details</span></li>
              <li><CheckCircle size={15} color="#10b981" /> <span>Daily goals tracker with completion rewards</span></li>
              <li><CheckCircle size={15} color="#10b981" /> <span>Streak preservation notifications</span></li>
            </ul>
          </div>

          {/* Module 5: Real-Time Leaderboard */}
          <div className="module-card">
            <div className="module-icon-wrap">
              <Award size={24} color="#10b981" />
            </div>
            <h3 className="module-title">Real-Time Peer Leaderboard</h3>
            <p className="module-desc">
              Benchmark your standing against top candidates nationwide. Real-time Socket.io
              updates broadcast rankings as soon as problems or tests are completed.
            </p>
            <ul className="module-features-list">
              <li><CheckCircle size={15} color="#10b981" /> <span>Dynamic Top 3 podium animations</span></li>
              <li><CheckCircle size={15} color="#10b981" /> <span>College & branch percentile rankings</span></li>
              <li><CheckCircle size={15} color="#10b981" /> <span>Badge unlocks & milestone awards</span></li>
            </ul>
          </div>

          {/* Module 6: Candidate Profile */}
          <div className="module-card">
            <div className="module-icon-wrap">
              <ShieldCheck size={24} color="#10b981" />
            </div>
            <h3 className="module-title">Candidate Portfolio & Profile</h3>
            <p className="module-desc">
              Showcase your skills matrix, target dream companies, GitHub & LinkedIn profiles,
              and manage your secure login credentials in one place.
            </p>
            <ul className="module-features-list">
              <li><CheckCircle size={15} color="#10b981" /> <span>Interactive skills tags manager</span></li>
              <li><CheckCircle size={15} color="#10b981" /> <span>Target company alignment radar</span></li>
              <li><CheckCircle size={15} color="#10b981" /> <span>Secure bcrypt password management</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ROADMAP SECTION ("From Day 1 to Offer Letter")
          ========================================================================= */}
      <section className="landing-roadmap-section" id="roadmap">
        <div className="landing-section-header">
          <div className="landing-pill sub">
            <Compass size={13} color="#10b981" />
            <span>The Placement Blueprint</span>
          </div>
          <h2 className="landing-section-title">
            Your 4-Phase Journey to <span className="landing-gradient-text">Day-1 Selection</span>
          </h2>
          <p className="landing-section-subtitle">
            A structured, data-driven methodology that takes you from fundamental concepts
            to acing final round technical interviews.
          </p>
        </div>

        <div className="roadmap-timeline">
          <div className="roadmap-step">
            <div className="step-number">01</div>
            <div className="step-content">
              <h4 className="step-title">Diagnostic Assessment</h4>
              <p className="step-desc">
                Complete a comprehensive baseline diagnostic across DSA and Aptitude to
                establish your initial skill profile and calibrate your goals.
              </p>
            </div>
          </div>

          <div className="roadmap-connector"></div>

          <div className="roadmap-step">
            <div className="step-number">02</div>
            <div className="step-content">
              <h4 className="step-title">Precision Practice & Heatmap</h4>
              <p className="step-desc">
                Tackle daily goals, build an unbroken 52-week green streak, and systematically
                repair flagged weak areas (&lt;60% accuracy).
              </p>
            </div>
          </div>

          <div className="roadmap-connector"></div>

          <div className="roadmap-step">
            <div className="step-number">03</div>
            <div className="step-content">
              <h4 className="step-title">Timed Pressure Simulations</h4>
              <p className="step-desc">
                Take company-specific mock tests with live countdown timers and negative
                marking to eliminate exam anxiety and master pacing.
              </p>
            </div>
          </div>

          <div className="roadmap-connector"></div>

          <div className="roadmap-step highlight">
            <div className="step-number green">04</div>
            <div className="step-content">
              <h4 className="step-title">Offer Letter Day</h4>
              <p className="step-desc">
                Step into interview rooms with verified readiness (90%+ readiness index),
                solid problem velocity, and undeniable confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          TESTIMONIALS SECTION
          ========================================================================= */}
      <section className="landing-testimonials-section" id="testimonials">
        <div className="landing-section-header">
          <div className="landing-pill sub">
            <Users size={13} color="#10b981" />
            <span>Success Stories</span>
          </div>
          <h2 className="landing-section-title">
            Placed at Top <span className="landing-gradient-text">Tech Companies</span>
          </h2>
          <p className="landing-section-subtitle">
            Hear from engineering graduates who transformed their preparation using Campus2Career.
          </p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#10b981" color="#10b981" />
              ))}
            </div>
            <p className="testimonial-text">
              "The weak area analytics saved my preparation. Campus2Career alerted me that my DP
              and Graph accuracy was under 50% three weeks before my drive. Focused on them and
              cracked the interview!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">AK</div>
              <div className="author-info">
                <span className="author-name">Ananya Kulkarni</span>
                <span className="author-role">Software Engineer • <strong>Google</strong></span>
              </div>
            </div>
          </div>

          <div className="testimonial-card highlight">
            <div className="testimonial-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#10b981" color="#10b981" />
              ))}
            </div>
            <p className="testimonial-text">
              "The TCS Digital mock test simulation with the exact negative marking and countdown timer
              made the actual exam feel like just another practice test. Landed the 9 LPA package easily!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar green">RS</div>
              <div className="author-info">
                <span className="author-name">Rahul Sharma</span>
                <span className="author-role">Digital Specialist Engineer • <strong>TCS</strong></span>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#10b981" color="#10b981" />
              ))}
            </div>
            <p className="testimonial-text">
              "The 52-week green heatmap gamified my daily consistency. I solved at least 3 problems
              every single morning. The real-time leaderboard motivated our entire batch."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">SM</div>
              <div className="author-info">
                <span className="author-name">Sneha Mukherjee</span>
                <span className="author-role">Cloud Associate • <strong>Amazon AWS</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BOTTOM CTA SECTION
          ========================================================================= */}
      <section className="landing-cta-banner">
        <div className="cta-banner-content">
          <div className="cta-icon-glow">
            <GraduationCap size={36} color="#10b981" />
          </div>
          <h2 className="cta-banner-title">
            Ready to Accelerate Your <span className="landing-gradient-text">Tech Career?</span>
          </h2>
          <p className="cta-banner-sub">
            Join thousands of candidates preparing smarter with Campus2Career.
            Zero installation needed — start solving instantly in your browser.
          </p>
          <div className="cta-banner-buttons">
            <Link to="/register" className="landing-btn-hero-primary large">
              <span>Create Free Account</span>
              <ArrowRight size={18} />
            </Link>
            <button
              onClick={handleDemoLogin}
              disabled={demoLoading}
              className="landing-btn-hero-secondary large"
            >
              <Sparkles size={17} />
              <span>{demoLoading ? 'Logging In...' : 'Launch Instant Demo'}</span>
            </button>
          </div>
          <div className="cta-guarantees">
            <span>✓ 100% Free Forever for Students</span>
            <span>✓ No Credit Card Required</span>
            <span>✓ Works on All Devices</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER
          ========================================================================= */}
      <footer className="landing-footer">
        <div className="landing-footer-top">
          <div className="footer-brand">
            <div className="landing-logo">
              <div className="landing-logo-icon small">
                <GraduationCap size={18} color="#ffffff" />
              </div>
              <span className="landing-brand-name">Campus<span className="landing-brand-green">2</span>Career</span>
            </div>
            <p className="footer-brand-desc">
              The full-stack placement preparation ecosystem designed to turn engineering candidates
              into day-one hiring prospects.
            </p>
            <div className="footer-status-pill">
              <span className="footer-dot-pulse"></span>
              <span>All Systems Operational • Ready for Campus Drives</span>
            </div>
          </div>

          <div className="footer-links-group">
            <div className="footer-col">
              <h5>Platform</h5>
              <a href="#features">Practice Tracker</a>
              <a href="#modules">Mock Arena</a>
              <a href="#modules">Weak Area Radar</a>
              <a href="#roadmap">Preparation Roadmap</a>
            </div>
            <div className="footer-col">
              <h5>Mock Patterns</h5>
              <Link to="/tests">TCS NQT Simulation</Link>
              <Link to="/tests">Infosys Springboard</Link>
              <Link to="/tests">Cognizant GenC Next</Link>
              <Link to="/tests">Product Round DSA</Link>
            </div>
            <div className="footer-col">
              <h5>Candidate Auth</h5>
              <Link to="/login">Sign In</Link>
              <Link to="/register">Create Account</Link>
              <button onClick={handleDemoLogin} className="footer-link-btn">Demo Account</button>
              <Link to="/dashboard">Dashboard</Link>
            </div>
          </div>
        </div>

        <div className="landing-footer-bottom">
          <p>© {new Date().getFullYear()} Campus2Career. Built for Placement Excellence. All rights reserved.</p>
          <div className="footer-tagline">
            <span>Designed with</span>
            <span className="heart-icon">💚</span>
            <span>for aspiring engineers everywhere</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
