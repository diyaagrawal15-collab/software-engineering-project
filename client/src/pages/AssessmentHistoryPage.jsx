import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assessmentService } from '../services/api';
import {
  Activity,
  Calendar,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  GitCompare,
} from 'lucide-react';

const AssessmentHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Comparison selection
  const [selectedId1, setSelectedId1] = useState('');
  const [selectedId2, setSelectedId2] = useState('');
  const [comparisonResult, setComparisonResult] = useState(null);
  const [comparing, setComparing] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await assessmentService.getHistory();
        if (res.data.success) {
          setHistory(res.data.data);
          if (res.data.data.length >= 2) {
            setSelectedId1(res.data.data[1]._id);
            setSelectedId2(res.data.data[0]._id);
          }
        }
      } catch (err) {
        setError('Failed to fetch assessment history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleCompare = async () => {
    if (!selectedId1 || !selectedId2 || selectedId1 === selectedId2) return;
    setComparing(true);
    try {
      const res = await assessmentService.compare(selectedId1, selectedId2);
      if (res.data.success) {
        setComparisonResult(res.data.data);
      }
    } catch (err) {
      console.error('Comparison error:', err);
    } finally {
      setComparing(false);
    }
  };

  return (
    <div style={{ padding: '3rem 0', minHeight: '80vh' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', color: '#0f172a', marginBottom: '0.25rem' }}>
              Assessment History & Comparisons
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Track how your perceived stress levels evolve over weeks and months
            </p>
          </div>

          <Link to="/assessment" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
            <Activity size={17} />
            Take New Assessment
          </Link>
        </div>

        {/* Side-by-Side Comparison Tool */}
        {history.length >= 2 && (
          <div className="card" style={{ marginBottom: '2.5rem', backgroundColor: '#f0fdfa', borderColor: '#ccfbf1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <GitCompare size={20} style={{ color: '#0d9488' }} />
              <h3 style={{ fontSize: '1.15rem', color: '#0f766e', margin: 0 }}>
                Compare Two Past Assessments
              </h3>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ flex: 1, minWidth: '220px' }}>
                <label className="form-label">Baseline Assessment (Earlier)</label>
                <select
                  value={selectedId1}
                  onChange={(e) => setSelectedId1(e.target.value)}
                  className="form-select"
                >
                  {history.map((a) => (
                    <option key={a._id} value={a._id}>
                      {new Date(a.createdAt).toLocaleDateString()} — {a.stressLevel} ({a.totalScore}/40)
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1, minWidth: '220px' }}>
                <label className="form-label">Comparison Assessment (Later)</label>
                <select
                  value={selectedId2}
                  onChange={(e) => setSelectedId2(e.target.value)}
                  className="form-select"
                >
                  {history.map((a) => (
                    <option key={a._id} value={a._id}>
                      {new Date(a.createdAt).toLocaleDateString()} — {a.stressLevel} ({a.totalScore}/40)
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleCompare}
                disabled={comparing || selectedId1 === selectedId2}
                className="btn btn-primary"
                style={{ height: '42px', marginTop: '1.25rem' }}
              >
                {comparing ? 'Comparing...' : 'Run Comparison'}
              </button>
            </div>

            {/* Comparison Output Box */}
            {comparisonResult && (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '1.25rem', border: '1px solid #99f6e4', marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>
                    Comparison Outcome: {comparisonResult.status}
                  </span>
                  <span style={{
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    color: comparisonResult.scoreDifference <= 0 ? '#10b981' : '#ef4444'
                  }}>
                    Score Delta: {comparisonResult.scoreDifference > 0 ? `+${comparisonResult.scoreDifference}` : comparisonResult.scoreDifference} pts
                  </span>
                </div>

                <div className="grid-4" style={{ marginTop: '0.75rem' }}>
                  <div style={{ padding: '0.5rem', background: '#f8fafc', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Emotional Change</div>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{comparisonResult.categoryComparison.emotional} pts</div>
                  </div>
                  <div style={{ padding: '0.5rem', background: '#f8fafc', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Cognitive Change</div>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{comparisonResult.categoryComparison.cognitive} pts</div>
                  </div>
                  <div style={{ padding: '0.5rem', background: '#f8fafc', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Behavioral Change</div>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{comparisonResult.categoryComparison.behavioral} pts</div>
                  </div>
                  <div style={{ padding: '0.5rem', background: '#f8fafc', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Physical Change</div>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{comparisonResult.categoryComparison.physical} pts</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* History Table / Cards */}
        {history.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {history.map((item, index) => (
              <div
                key={item._id}
                className="card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: item.stressLevel === 'Low' ? '#d1fae5' : item.stressLevel === 'Moderate' ? '#fef3c7' : '#fee2e2',
                    color: item.stressLevel === 'Low' ? '#065f46' : item.stressLevel === 'Moderate' ? '#92400e' : '#991b1b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.25rem'
                  }}>
                    {item.totalScore}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`badge badge-${item.stressLevel.toLowerCase()}`}>
                        {item.stressLevel} Stress
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        PSS-10 Evaluation #{history.length - index}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
                      {item.summaryText.substring(0, 85)}...
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'right' }}>
                    <div>{new Date(item.createdAt).toLocaleDateString()}</div>
                    <div>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  <Link
                    to={`/assessment/result/${item._id}`}
                    className="btn btn-secondary"
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <Activity size={36} style={{ color: '#94a3b8', margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No assessments completed yet</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Your completed PSS-10 stress tests will be stored and tracked here.
            </p>
            <Link to="/assessment" className="btn btn-primary">
              Take Your First Assessment
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default AssessmentHistoryPage;
