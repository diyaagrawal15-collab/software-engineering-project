import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessmentService } from '../services/api';
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

const OPTIONS = [
  { value: 0, label: 'Never', desc: '0 points' },
  { value: 1, label: 'Almost Never', desc: '1 point' },
  { value: 2, label: 'Sometimes', desc: '2 points' },
  { value: 3, label: 'Fairly Often', desc: '3 points' },
  { value: 4, label: 'Very Often', desc: '4 points' },
];

const StressAssessmentPage = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // { 1: 2, 2: 3, ... }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await assessmentService.getQuestions();
        if (res.data.success) {
          setQuestions(res.data.data);
        }
      } catch (err) {
        setError('Failed to load assessment questionnaire. Please refresh.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleSelectOption = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (answeredCount < questions.length) {
      setError(`Please answer all ${questions.length} questions before submitting.`);
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const payloadAnswers = Object.entries(answers).map(([qId, val]) => ({
        questionId: Number(qId),
        responseValue: Number(val),
      }));

      const res = await assessmentService.submitAssessment(payloadAnswers);
      if (res.data.success) {
        navigate(`/assessment/result/${res.data.data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving assessment results.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <p style={{ color: '#64748b' }}>Loading assessment questions...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: '#e0f2fe',
            color: '#0284c7',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '0.75rem'
          }}>
            <Activity size={15} />
            <span>Perceived Stress Scale (PSS-10)</span>
          </div>
          <h1 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '0.5rem' }}>
            Personal Stress Evaluation
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
            Answer these 10 questions regarding your feelings and thoughts during the last month. There are no right or wrong answers.
          </p>
        </div>

        {/* Clinical Disclaimer */}
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center'
        }}>
          <ShieldCheck size={22} style={{ color: '#0284c7', flexShrink: 0 }} />
          <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
            <strong>Ethical & Safety Notice:</strong> This questionnaire measures perceived stress for lifestyle awareness. It is not an automated medical or psychological diagnosis.
          </p>
        </div>

        {/* Sticky Progress Bar */}
        <div style={{
          position: 'sticky',
          top: '70px',
          zIndex: 80,
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          padding: '0.85rem 1.25rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
              Progress: {answeredCount} of {questions.length} Answered
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0284c7' }}>
              {progressPercent}%
            </span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                backgroundColor: '#0284c7',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Questions Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {questions.map((q, idx) => {
              const selectedValue = answers[q.id];
              const isAnswered = selectedValue !== undefined;

              return (
                <div
                  key={q.id}
                  className="card"
                  style={{
                    borderColor: isAnswered ? '#bae6fd' : 'var(--border)',
                    backgroundColor: isAnswered ? '#ffffff' : '#fafafa',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <span style={{
                      backgroundColor: isAnswered ? '#0284c7' : '#cbd5e1',
                      color: '#ffffff',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      flexShrink: 0
                    }}>
                      {idx + 1}
                    </span>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: 600, lineHeight: 1.4 }}>
                        {q.text}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'capitalize' }}>
                        Dimension: {q.category}
                      </span>
                    </div>
                  </div>

                  {/* Likert Options */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: '0.5rem'
                  }}>
                    {OPTIONS.map((opt) => {
                      const isOptionSelected = selectedValue === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleSelectOption(q.id, opt.value)}
                          style={{
                            padding: '0.75rem 0.5rem',
                            borderRadius: '8px',
                            border: isOptionSelected ? '2px solid #0284c7' : '1px solid var(--border)',
                            backgroundColor: isOptionSelected ? '#e0f2fe' : '#ffffff',
                            color: isOptionSelected ? '#0369a1' : '#334155',
                            fontWeight: isOptionSelected ? 700 : 500,
                            fontSize: '0.85rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.2rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span>{opt.label}</span>
                          <span style={{ fontSize: '0.7rem', color: isOptionSelected ? '#0284c7' : '#94a3b8' }}>
                            {opt.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Action */}
          <div style={{ textAlign: 'center' }}>
            <button
              type="submit"
              disabled={submitting || answeredCount < questions.length}
              className="btn btn-primary"
              style={{
                padding: '0.9rem 2.5rem',
                fontSize: '1.05rem',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
              }}
            >
              {submitting ? 'Calculating Stress Profile...' : 'Calculate My Stress Score'}
            </button>
            {answeredCount < questions.length && (
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                Please select an answer for all {questions.length} questions to calculate your score.
              </p>
            )}
          </div>
        </form>

      </div>
    </div>
  );
};

export default StressAssessmentPage;
