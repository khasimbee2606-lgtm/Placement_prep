import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  FileCheck2,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Award,
  Sparkles,
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
    if (!window.confirm('Are you ready to submit your test? You will see instant scoring and question explanations.')) return;
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
              particleCount: 70,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#16A34A', '#22C55E', '#065F46', '#DCFCE7'],
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

  const questions = activeTest?.questions || [];
  const currentQ = questions[currentQIndex];

  return (
    <div className="page-transition">
      {/* 1. ACTIVE EXAM INTERFACE */}
      {activeTest && currentQ ? (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.06)' }}>
          {/* Sticky Timer at Top */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.25rem', borderBottom: '1px solid #F3F4F6', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#DCFCE7', color: '#16A34A', padding: '0.2rem 0.65rem', borderRadius: '999px' }}>
                {activeTest.companyPattern}
              </span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1F2937', marginTop: '0.35rem' }}>
                {activeTest.title}
              </h2>
            </div>

            {/* Countdown Timer with Warning Color */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                background: timeLeft < 180 ? '#FEF2F2' : '#F0FDF4',
                border: '1px solid',
                borderColor: timeLeft < 180 ? '#FCA5A5' : '#DCFCE7',
                color: timeLeft < 180 ? '#DC2626' : '#16A34A',
                fontWeight: 800,
                fontSize: '1.15rem',
              }}
            >
              <Clock size={20} className={timeLeft < 180 ? 'animated-pulse' : ''} />
              <span>{formatTimer(timeLeft)}</span>
            </div>
          </div>

          {/* Section & Question Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#16A34A' }}>
              Question {currentQIndex + 1} of {questions.length} &bull; Section: {currentQ.section || 'General'}
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
                      borderRadius: '8px',
                      border: isCurrent ? '2px solid #16A34A' : '1px solid #E5E7EB',
                      background: isAnswered ? '#16A34A' : isCurrent ? '#DCFCE7' : '#F8F6F1',
                      color: isAnswered ? '#FFFFFF' : isCurrent ? '#065F46' : '#4B5563',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Panel */}
          <div style={{ background: '#F8F6F1', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.8rem', color: '#6B7280' }}>
              <span>Marks: <strong style={{ color: '#16A34A' }}>+{currentQ.marks || 2}</strong></span>
              <span>Negative: <strong style={{ color: '#DC2626' }}>-{currentQ.negativeMarks || 0.5}</strong></span>
            </div>

            <p style={{ fontSize: '1.05rem', fontWeight: 600, color: '#1F2937', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {currentQ.question}
            </p>

            {/* Options List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = userAnswers[currentQ._id] === oIdx;
                const letter = String.fromCharCode(65 + oIdx);
                return (
                  <div
                    key={oIdx}
                    onClick={() => handleSelectOption(currentQ._id, oIdx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      padding: '0.85rem 1.15rem',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      background: isSelected ? '#DCFCE7' : '#FFFFFF',
                      border: '1.5px solid',
                      borderColor: isSelected ? '#16A34A' : '#E5E7EB',
                      boxShadow: isSelected ? '0 0 10px rgba(22, 163, 74, 0.15)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        background: isSelected ? '#16A34A' : '#F3F4F6',
                        color: isSelected ? '#FFFFFF' : '#4B5563',
                      }}
                    >
                      {letter}
                    </span>
                    <span style={{ fontSize: '0.92rem', color: isSelected ? '#065F46' : '#1F2937', fontWeight: isSelected ? 600 : 400 }}>
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
                  style={{ color: '#DC2626', borderColor: '#FECACA' }}
                >
                  <RotateCcw size={14} /> Clear Choice
                </button>
              )}
            </div>

            {/* Highlighted Green Submit Button */}
            <button
              onClick={handleSubmitTest}
              disabled={isSubmitting}
              className="btn-primary"
              style={{ padding: '0.75rem 1.6rem', fontSize: '0.95rem', fontWeight: 700 }}
              id="submit-test-btn"
            >
              {isSubmitting ? 'Evaluating...' : 'Finish & Submit Test'}
            </button>
          </div>
        </div>
      ) : (
        /* 2. CATALOG & PAST TEST RESULTS */
        <div>
          <div className="page-header" style={{ marginBottom: '1.75rem' }}>
            <div>
              <h1 className="page-title" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1F2937' }}>
                Mock Test <span style={{ color: '#16A34A' }}>Simulator</span>
              </h1>
              <p className="page-subtitle" style={{ fontSize: '0.88rem', color: '#6B7280' }}>
                Real-world timed assessments matching TCS NQT, Infosys SP, and Wipro placement cut-offs.
              </p>
            </div>
          </div>

          {/* Available Tests Cards Grid */}
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1F2937', marginBottom: '1rem' }}>
            Available Recruitment Mock Assessments
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {tests.map((test) => (
              <div key={test._id} className="metric-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#DCFCE7', color: '#16A34A', padding: '0.2rem 0.65rem', borderRadius: '999px', alignSelf: 'flex-start', marginBottom: '0.75rem' }}>
                  {test.companyPattern}
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1F2937', marginBottom: '0.5rem' }}>
                  {test.title}
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#4B5563', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  Sectional test covering Aptitude, Logical Reasoning, and Technical Coding with realistic negative marking.
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6', marginBottom: '1.25rem', fontSize: '0.82rem', color: '#6B7280' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={15} style={{ color: '#16A34A' }} /> {test.duration} Mins
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FileCheck2 size={15} style={{ color: '#16A34A' }} /> {test.totalQuestions || test.questions?.length || 6} Questions
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#16A34A', fontWeight: 600 }}>
                    <Award size={15} /> {test.passMarks}% Pass
                  </span>
                </div>

                <button
                  onClick={() => handleStartTest(test._id)}
                  className="btn-primary"
                  style={{ width: '100%', marginTop: 'auto' }}
                >
                  <span>Attempt Assessment</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Past Attempts Results Table */}
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1F2937', marginBottom: '1rem' }}>
            Your Assessment Performance History
          </h2>

          <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            {pastResults.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
                <FileCheck2 size={40} style={{ margin: '0 auto 0.75rem', color: '#16A34A', opacity: 0.6 }} />
                <p style={{ fontWeight: 600, color: '#1F2937' }}>No assessment history recorded yet.</p>
                <p style={{ fontSize: '0.82rem', color: '#6B7280', marginTop: '0.25rem' }}>
                  Take a mock test above to benchmark your score against day-1 recruitment cut-offs!
                </p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8F6F1', borderBottom: '1px solid #E5E7EB' }}>
                    <th style={{ padding: '0.9rem 1.25rem', textAlign: 'left', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563' }}>Assessment</th>
                    <th style={{ padding: '0.9rem 1rem', textAlign: 'left', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563' }}>Pattern</th>
                    <th style={{ padding: '0.9rem 1rem', textAlign: 'left', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563' }}>Score</th>
                    <th style={{ padding: '0.9rem 1rem', textAlign: 'left', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563' }}>Accuracy</th>
                    <th style={{ padding: '0.9rem 1rem', textAlign: 'left', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563' }}>Status</th>
                    <th style={{ padding: '0.9rem 1.25rem', textAlign: 'left', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {pastResults.map((r) => (
                    <tr key={r._id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#1F2937' }}>{r.testId?.title || 'Mock Assessment'}</td>
                      <td style={{ padding: '1rem 1rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#DCFCE7', color: '#16A34A', padding: '0.2rem 0.55rem', borderRadius: '999px' }}>
                          {r.testId?.companyPattern || 'TCS NQT'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1rem', fontWeight: 700, color: '#1F2937' }}>
                        {r.score} / {r.totalMarks}
                      </td>
                      <td style={{ padding: '1rem 1rem' }}>
                        <span style={{ fontWeight: 700, color: r.accuracy >= 60 ? '#16A34A' : '#DC2626' }}>
                          {r.accuracy}%
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1rem' }}>
                        {r.status === 'Passed' ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', fontWeight: 700, color: '#16A34A', background: '#DCFCE7', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                            <CheckCircle size={13} /> Passed
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', fontWeight: 700, color: '#DC2626', background: '#FEE2E2', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                            <XCircle size={13} /> Review Needed
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', fontSize: '0.82rem', color: '#6B7280' }}>
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
          <div className="modal-content" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', maxWidth: '680px', width: '92%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#DCFCE7', color: '#16A34A', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                  {testReport.companyPattern}
                </span>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1F2937', marginTop: '0.35rem' }}>
                  Assessment Report: {testReport.testTitle}
                </h2>
              </div>
              <button
                onClick={() => setTestReport(null)}
                style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Score Summary Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#F8F6F1', padding: '1rem', borderRadius: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>Score Obtained</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1F2937', marginTop: '0.2rem' }}>
                  {testReport.score} <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>/ {testReport.totalMarks}</span>
                </div>
              </div>

              <div style={{ background: '#F8F6F1', padding: '1rem', borderRadius: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>Overall Accuracy</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: testReport.accuracy >= 60 ? '#16A34A' : '#DC2626', marginTop: '0.2rem' }}>
                  {testReport.accuracy}%
                </div>
              </div>

              <div style={{ background: testReport.status === 'Passed' ? '#DCFCE7' : '#FEE2E2', padding: '1rem', borderRadius: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: testReport.status === 'Passed' ? '#065F46' : '#991B1B' }}>Final Verdict</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: testReport.status === 'Passed' ? '#16A34A' : '#DC2626', marginTop: '0.2rem' }}>
                  {testReport.status === 'Passed' ? 'Passed 🎉' : 'Needs Work'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button onClick={() => setTestReport(null)} className="btn-primary">
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockTests;
