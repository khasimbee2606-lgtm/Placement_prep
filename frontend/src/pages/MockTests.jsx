import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  FileCheck2,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Award,
  BookOpen,
  ChevronRight,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

const MockTests = () => {
  const { updateUser } = useAuth();
  const [tests, setTests] = useState([]);
  const [pastResults, setPastResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Test state
  const [activeTest, setActiveTest] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [currentSection, setCurrentSection] = useState('All');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Completed result report
  const [testReport, setTestReport] = useState(null);

  // Fetch tests and past results
  const loadData = async () => {
    try {
      setLoading(true);
      const [testsRes, resultsRes] = await Promise.all([
        API.get('/tests'),
        API.get('/tests/results/my'),
      ]);
      if (testsRes.data.success) setTests(testsRes.data.tests || []);
      if (resultsRes.data.success) setPastResults(resultsRes.data.results || []);
    } catch (err) {
      console.error('Error loading tests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (activeTest && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTest, timeLeft]);

  // Start test
  const handleStartTest = async (testId) => {
    try {
      setLoading(true);
      const res = await API.get(`/tests/${testId}`);
      if (res.data.success) {
        const t = res.data.test;
        setActiveTest(t);
        setTimeLeft(t.duration * 60); // minutes to seconds
        setUserAnswers({});
        setCurrentQIndex(0);
        setCurrentSection('All');
        setTestReport(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error starting test');
    } finally {
      setLoading(false);
    }
  };

  // Select option
  const handleSelectOption = (qId, optionIdx) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: optionIdx,
    }));
  };

  // Clear current response
  const handleClearOption = (qId) => {
    setUserAnswers((prev) => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
  };

  // Submit test
  const handleSubmitTest = async () => {
    if (!window.confirm('Are you ready to submit your test? You will see immediate scoring and question explanations.')) return;
    performSubmission();
  };

  const handleAutoSubmit = () => {
    alert('⏱️ Time has expired! Your test is automatically being submitted now.');
    performSubmission();
  };

  const performSubmission = async () => {
    if (!activeTest || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const timeSpentSeconds = (activeTest.duration * 60) - timeLeft;
      const res = await API.post(`/tests/${activeTest._id}/submit`, {
        answers: userAnswers,
        timeSpent: timeSpentSeconds,
      });

      if (res.data.success) {
        setTestReport(res.data.result);
        if (res.data.userPoints) {
          updateUser({ points: res.data.userPoints });
        }
        if (res.data.result.status === 'Passed') {
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#10b981', '#34d399', '#f59e0b'],
            });
          } catch {}
        }
        setActiveTest(null);
        loadData();
      }
    } catch (err) {
      alert('Error submitting test: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Active question filtering
  const questions = activeTest?.questions || [];
  const currentQ = questions[currentQIndex];

  return (
    <div>
      {/* 1. ACTIVE TEST ARENA */}
      {activeTest && currentQ ? (
        <div className="test-arena">
          {/* Header */}
          <div className="test-arena-header">
            <div>
              <span className="test-pattern-badge">{activeTest.companyPattern}</span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                {activeTest.title}
              </h2>
            </div>

            {/* Countdown Timer */}
            <div className={`timer-box ${timeLeft < 180 ? 'timer-warning' : ''}`}>
              <Clock size={22} />
              <span>{formatTimer(timeLeft)}</span>
            </div>
          </div>

          {/* Section & Question Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399' }}>
              Question {currentQIndex + 1} of {questions.length} &bull; Section: {currentQ.section}
            </span>

            {/* Question Quick Palette */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {questions.map((q, idx) => {
                const isAnswered = userAnswers[q._id] !== undefined;
                const isCurrent = idx === currentQIndex;
                return (
                  <button
                    key={q._id}
                    onClick={() => setCurrentQIndex(idx)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      border: isCurrent ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                      background: isAnswered ? '#059669' : 'rgba(255,255,255,0.05)',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Box */}
          <div className="question-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.8rem', color: '#9cd4b5' }}>
              <span>Marks: +{currentQ.marks || 2}</span>
              <span style={{ color: '#fb7185' }}>Negative Marking: -{currentQ.negativeMarks || 0.5}</span>
            </div>

            <p className="question-text">{currentQ.question}</p>

            <div className="options-list">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = userAnswers[currentQ._id] === oIdx;
                const letter = String.fromCharCode(65 + oIdx);
                return (
                  <div
                    key={oIdx}
                    onClick={() => handleSelectOption(currentQ._id, oIdx)}
                    className={`option-item ${isSelected ? 'selected' : ''}`}
                  >
                    <span className="option-letter">{letter}</span>
                    <span style={{ fontSize: '0.95rem', color: isSelected ? '#f0fdf4' : '#cbd5e1' }}>
                      {opt}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Arena Footer Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setCurrentQIndex(Math.max(0, currentQIndex - 1))}
                disabled={currentQIndex === 0}
                className="btn-outline"
              >
                <ArrowLeft size={16} /> Previous
              </button>
              <button
                onClick={() => setCurrentQIndex(Math.min(questions.length - 1, currentQIndex + 1))}
                disabled={currentQIndex === questions.length - 1}
                className="btn-outline"
              >
                Next <ArrowRight size={16} />
              </button>
              {userAnswers[currentQ._id] !== undefined && (
                <button
                  onClick={() => handleClearOption(currentQ._id)}
                  className="btn-outline"
                  style={{ color: '#fb7185' }}
                >
                  <RotateCcw size={14} /> Clear Response
                </button>
              )}
            </div>

            <button
              onClick={handleSubmitTest}
              disabled={isSubmitting}
              className="btn-primary"
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
            >
              {isSubmitting ? 'Evaluating Test...' : 'Finish & Submit Test'}
            </button>
          </div>
        </div>
      ) : (
        /* 2. CATALOG & PAST RESULTS */
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">
                Mock Test <span className="green-gradient-text">Simulator</span>
              </h1>
              <p className="page-subtitle">
                Company-specific timed assessments matching TCS NQT, Infosys Springboard & Wipro patterns.
              </p>
            </div>
          </div>

          {/* Available Tests Cards Grid */}
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f0fdf4', marginBottom: '1rem' }}>
            Featured Company Mock Tests
          </h2>

          <div className="test-cards-grid" style={{ marginBottom: '2.5rem' }}>
            {tests.map((test) => (
              <div key={test._id} className="test-card">
                <span className="test-pattern-badge">{test.companyPattern}</span>
                <h3 className="test-title">{test.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#9cd4b5', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  Simulate official recruitment criteria. Sections include Aptitude, Logical Reasoning, and Technical Coding with negative marking.
                </p>

                <div className="test-meta-row">
                  <div className="test-meta-item">
                    <Clock size={16} /> {test.duration} Minutes
                  </div>
                  <div className="test-meta-item">
                    <FileCheck2 size={16} /> {test.totalQuestions || test.questions?.length || 6} Questions
                  </div>
                  <div className="test-meta-item" style={{ color: '#34d399' }}>
                    <Award size={16} /> {test.passMarks}% Pass Cutoff
                  </div>
                </div>

                <button
                  onClick={() => handleStartTest(test._id)}
                  className="btn-primary"
                  style={{ marginTop: 'auto' }}
                >
                  Attempt Mock Test <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Past Attempts Results Table */}
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f0fdf4', marginBottom: '1rem' }}>
            Your Test History & Performance Reports
          </h2>

          <div className="data-table-container">
            {pastResults.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#6ee7b7' }}>
                You have not attempted any mock tests yet. Take your first test above to evaluate your cut-off score!
              </div>
            ) : (
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Mock Test</th>
                    <th>Pattern</th>
                    <th>Score</th>
                    <th>Accuracy</th>
                    <th>Status</th>
                    <th>Date Attempted</th>
                  </tr>
                </thead>
                <tbody>
                  {pastResults.map((r) => (
                    <tr key={r._id}>
                      <td style={{ fontWeight: 600, color: '#f0fdf4' }}>{r.testId?.title || 'Mock Assessment'}</td>
                      <td>
                        <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                          {r.testId?.companyPattern || 'TCS NQT'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: '#f0fdf4' }}>
                        {r.score} / {r.totalMarks}
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: r.accuracy >= 60 ? '#34d399' : '#fb7185' }}>
                          {r.accuracy}%
                        </span>
                      </td>
                      <td>
                        {r.status === 'Passed' ? (
                          <span className="badge badge-correct">
                            <CheckCircle size={13} /> Passed
                          </span>
                        ) : (
                          <span className="badge badge-incorrect">
                            <XCircle size={13} /> Needs Review
                          </span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#6ee7b7' }}>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* 3. TEST RESULT REPORT MODAL */}
      {testReport && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '750px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge badge-easy">{testReport.companyPattern}</span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginTop: '0.35rem' }}>
                  Assessment Report: {testReport.testTitle}
                </h2>
              </div>
              <button
                onClick={() => setTestReport(null)}
                style={{ background: 'none', border: 'none', color: '#9cd4b5', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Score Banner */}
            <div
              style={{
                background: testReport.status === 'Passed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                border: testReport.status === 'Passed' ? '1px solid #10b981' : '1px solid #f43f5e',
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <div>
                <span style={{ fontSize: '0.85rem', color: '#9cd4b5', textTransform: 'uppercase', fontWeight: 700 }}>
                  Test Verdict
                </span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: testReport.status === 'Passed' ? '#34d399' : '#fb7185' }}>
                  {testReport.status === 'Passed' ? 'PASSED CUT-OFF 🎉' : 'REQUIRES REVISION'}
                </h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
                  {testReport.score} <span style={{ fontSize: '1rem', color: '#9cd4b5' }}>/ {testReport.totalMarks}</span>
                </span>
                <p style={{ fontSize: '0.8rem', color: '#a7f3d0' }}>
                  {testReport.percentage}% Score &bull; {testReport.accuracy}% Accuracy
                </p>
              </div>
            </div>

            {/* Questions Detailed Breakdown */}
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.9rem' }}>
              Question Explanations & Key Insights
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '350px', overflowY: 'auto' }}>
              {testReport.evaluatedQuestions?.map((q, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#09130e',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.8rem' }}>
                    <span style={{ fontWeight: 700, color: '#34d399' }}>
                      Q{idx + 1} &bull; {q.section}
                    </span>
                    <span style={{ fontWeight: 600, color: q.isCorrect ? '#34d399' : '#fb7185' }}>
                      {q.isCorrect ? '✅ Correct' : q.status === 'unattempted' ? '⚪ Skipped' : '❌ Incorrect (-0.5)'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#f0fdf4', marginBottom: '0.6rem' }}>{q.question}</p>
                  <p style={{ fontSize: '0.8rem', color: '#a7f3d0' }}>
                    <strong>Correct Option:</strong> {q.options[q.correctAnswer]}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: '#6ee7b7', fontStyle: 'italic', marginTop: '0.35rem' }}>
                    💡 Explanation: {q.explanation}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button onClick={() => setTestReport(null)} className="btn-primary">
                Done & Return to Catalog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockTests;
