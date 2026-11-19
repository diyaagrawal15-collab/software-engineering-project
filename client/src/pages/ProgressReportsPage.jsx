import React, { useState, useEffect } from 'react';
import { reportService } from '../services/api';
import {
  BarChart2,
  TrendingDown,
  TrendingUp,
  Activity,
  Calendar,
  Award,
  CheckCircle2,
  Printer,
  Sparkles,
  Heart,
  Smile,
} from 'lucide-react';

const ProgressReportsPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await reportService.getMyProgressReport();
        if (res.data.success) {
          setReport(res.data.data);
        }
      } catch (err) {
        setError('Failed to generate progress report.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <p style={{ color: '#64748b' }}>Compiling your personal progress analytics...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p style={{ color: '#ef4444' }}>{error || 'Unable to load progress report'}</p>
      </div>
    );
  }

  const { user, summary, assessmentTimeline, moodDistribution, recentAppointments } = report;

  return (
    <div style={{ padding: '3rem 0', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Header Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#e0e7ff', color: '#4f46e5', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              <BarChart2 size={15} />
              <span>Personal Wellness Analytics</span>
            </div>
            <h1 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '0.35rem' }}>
              Comprehensive Progress Report
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Prepared for {user.name} • Member since {new Date(user.memberSince).toLocaleDateString()}
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="btn btn-secondary"
            style={{ padding: '0.65rem 1.25rem', gap: '0.5rem' }}
          >
            <Printer size={16} />
            Print / Save Summary
          </button>
        </div>

        {/* Milestone Status Banner */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.35)'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#bae6fd' }}>
            Overall Trajectory & Insights
          </span>
          <h2 style={{ fontSize: '1.5rem', color: '#ffffff', margin: '0.35rem 0 0.75rem 0' }}>
            {summary.overallProgressStatus}
          </h2>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#e0f2fe' }}>Current Stress Level</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {summary.currentStressLevel} {summary.currentScore !== null && `(${summary.currentScore}/40)`}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#e0f2fe' }}>Assessments Completed</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{summary.totalAssessments} Tests</div>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#e0f2fe' }}>Reflective Journal Logs</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{summary.totalMoodLogs} Entries</div>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#e0f2fe' }}>Counseling Sessions</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{summary.totalAppointments} Sessions</div>
            </div>
          </div>
        </div>

        {/* Assessment Timeline Chart / Bar representation */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#0f172a' }}>
            Stress Score Evolution Over Time
          </h3>

          {assessmentTimeline && assessmentTimeline.length > 0 ? (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {assessmentTimeline.map((item, idx) => {
                  const pct = Math.round((item.score / 40) * 100);
                  const barColor =
                    item.level === 'Low' ? '#10b981' : item.level === 'Moderate' ? '#f59e0b' : '#ef4444';
                  return (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>
                          Evaluation on {item.date}
                        </span>
                        <span style={{ fontWeight: 700, color: barColor }}>
                          {item.level} ({item.score}/40)
                        </span>
                      </div>
                      <div style={{ height: '10px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', backgroundColor: barColor, borderRadius: '9999px' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              No assessment data available to plot timeline. Take your first PSS-10 evaluation to see your progress chart.
            </p>
          )}
        </div>

        {/* Mood Distribution Breakdown */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#0f172a' }}>
            Mood Log Distribution
          </h3>
          <div className="grid-4">
            {Object.entries(moodDistribution).map(([mood, count]) => (
              <div key={mood} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'capitalize' }}>{mood}</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Disclaimer on Printout */}
        <div style={{ textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', color: '#94a3b8', fontSize: '0.78rem' }}>
          This progress report is generated by StressCare for lifestyle monitoring and stress evaluation purposes based on user-entered data. It does not replace clinical psychological diagnoses.
        </div>

      </div>
    </div>
  );
};

export default ProgressReportsPage;
