import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { assessmentService } from '../services/api';
import {
  Activity,
  CheckCircle2,
  Calendar,
  Wind,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  ShieldCheck,
  Share2,
} from 'lucide-react';

const AssessmentResultPage = () => {
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await assessmentService.getById(id);
        if (res.data.success) {
          setAssessment(res.data.data);
        }
      } catch (err) {
        setError('Failed to load assessment results.');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <p style={{ color: '#64748b' }}>Analyzing your assessment responses...</p>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p style={{ color: '#ef4444' }}>{error || 'Assessment not found'}</p>
        <Link to="/assessment" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Take Assessment
        </Link>
      </div>
    );
  }

  const { totalScore, stressLevel, summaryText, categoryBreakdown, recommendedActions, primaryStressors, createdAt } = assessment;

  // Percentage on 0-40 scale
  const scorePercent = Math.round((totalScore / 40) * 100);

  const levelColor =
    stressLevel === 'Low' ? '#10b981' : stressLevel === 'Moderate' ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ padding: '3rem 0', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '850px' }}>
        
        {/* Results Card */}
        <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Assessment Report
              </span>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
                Completed on {new Date(createdAt).toLocaleDateString()} at {new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <Link to="/assessment/history" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              View Assessment History →
            </Link>
          </div>

          {/* Primary Score Dial / Gauge */}
          <div style={{
            background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'inline-block', marginBottom: '1rem' }}>
              <span className={`badge badge-${stressLevel.toLowerCase()}`} style={{ fontSize: '1rem', padding: '0.4rem 1.25rem' }}>
                {stressLevel} Perceived Stress
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '4rem', fontWeight: 800, color: levelColor, lineHeight: 1 }}>
                {totalScore}
              </span>
              <span style={{ fontSize: '1.25rem', color: '#94a3b8', fontWeight: 700 }}>/ 40 pts</span>
            </div>

            {/* Score Bar */}
            <div style={{ width: '100%', maxWidth: '400px', height: '12px', backgroundColor: '#e2e8f0', borderRadius: '9999px', margin: '0 auto 1.25rem auto', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${scorePercent}%`,
                  height: '100%',
                  backgroundColor: levelColor,
                  borderRadius: '9999px',
                  transition: 'width 0.8s ease'
                }}
              />
            </div>

            <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem', color: '#334155', lineHeight: 1.6 }}>
              {summaryText}
            </p>
          </div>

          {/* Category Dimensions Breakdown */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#0f172a' }}>
              Stress Dimensions Breakdown
            </h3>
            
            <div className="grid-2">
              
              <div style={{ border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem', backgroundColor: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.875rem', fontWeight: 600 }}>
                  <span>Emotional Strain</span>
                  <span style={{ color: '#0284c7' }}>{categoryBreakdown?.emotional || 0} pts</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, ((categoryBreakdown?.emotional || 0) / 12) * 100)}%`, height: '100%', backgroundColor: '#0284c7' }} />
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginTop: '0.25rem' }}>Anxiety, irritation, and unexpected pressure</span>
              </div>

              <div style={{ border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem', backgroundColor: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.875rem', fontWeight: 600 }}>
                  <span>Cognitive / Control Strain</span>
                  <span style={{ color: '#0d9488' }}>{categoryBreakdown?.cognitive || 0} pts</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, ((categoryBreakdown?.cognitive || 0) / 12) * 100)}%`, height: '100%', backgroundColor: '#0d9488' }} />
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginTop: '0.25rem' }}>Perceived ability to handle tasks & master situations</span>
              </div>

              <div style={{ border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem', backgroundColor: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.875rem', fontWeight: 600 }}>
                  <span>Behavioral Coping Fatigue</span>
                  <span style={{ color: '#6366f1' }}>{categoryBreakdown?.behavioral || 0} pts</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, ((categoryBreakdown?.behavioral || 0) / 8) * 100)}%`, height: '100%', backgroundColor: '#6366f1' }} />
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginTop: '0.25rem' }}>Ability to cope with piling responsibilities</span>
              </div>

              <div style={{ border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem', backgroundColor: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.875rem', fontWeight: 600 }}>
                  <span>Physical / Somatic Pressure</span>
                  <span style={{ color: '#f59e0b' }}>{categoryBreakdown?.physical || 0} pts</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, ((categoryBreakdown?.physical || 0) / 8) * 100)}%`, height: '100%', backgroundColor: '#f59e0b' }} />
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginTop: '0.25rem' }}>Feeling that difficulties are piling up beyond capacity</span>
              </div>

            </div>
          </div>

          {/* Recommended Next Actions */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#0f172a' }}>
              Actionable Self-Care Recommendations
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recommendedActions?.map((action, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <CheckCircle2 size={18} style={{ color: '#0284c7', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.5 }}>
                    {action}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            borderTop: '1px solid var(--border)',
            paddingTop: '1.75rem'
          }}>
            <Link to="/recommendations" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', flex: 1 }}>
              <Wind size={18} />
              Start 4-7-8 Breathing Guide
            </Link>

            <Link to="/appointments" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', flex: 1 }}>
              <Calendar size={18} />
              Consult a Wellness Counselor
            </Link>

            <Link to="/dashboard" className="btn btn-outline" style={{ padding: '0.75rem 1.25rem' }}>
              Return to Dashboard
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AssessmentResultPage;
