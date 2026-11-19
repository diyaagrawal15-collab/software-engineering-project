import React, { useState, useEffect } from 'react';
import { recommendationService, adminService } from '../services/api';
import {
  Sparkles,
  Wind,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  Heart,
  Shield,
  Compass,
  Moon,
  Zap,
} from 'lucide-react';

const CATEGORIES = [
  { key: 'all', label: 'All Protocols' },
  { key: 'breathing', label: 'Breathwork' },
  { key: 'relaxation', label: 'Relaxation' },
  { key: 'time_management', label: 'Time Management' },
  { key: 'healthy_habits', label: 'Daily Habits' },
  { key: 'articles', label: 'Articles & Guides' },
];

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [resources, setResources] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Interactive Breathing Guide State
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Ready'); // 'Inhale', 'Hold', 'Exhale'
  const [breathTimer, setBreathTimer] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recRes, resRes] = await Promise.all([
          recommendationService.getAll(),
          adminService.getResources({ type: 'article' }),
        ]);
        if (recRes.data.success) {
          setRecommendations(recRes.data.data);
        }
        if (resRes.data.success) {
          setResources(resRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Breathing Engine: 4-7-8 Breathwork
  useEffect(() => {
    let interval = null;
    if (breathingActive) {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev > 1) return prev - 1;

          // Transition phases:
          if (breathPhase === 'Ready' || breathPhase === 'Exhale') {
            setBreathPhase('Inhale');
            return 4;
          } else if (breathPhase === 'Inhale') {
            setBreathPhase('Hold');
            return 7;
          } else if (breathPhase === 'Hold') {
            setBreathPhase('Exhale');
            setCycleCount((c) => c + 1);
            return 8;
          }
          return 4;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [breathingActive, breathPhase]);

  const toggleBreathing = () => {
    if (!breathingActive) {
      setBreathPhase('Inhale');
      setBreathTimer(4);
      setBreathingActive(true);
    } else {
      setBreathingActive(false);
      setBreathPhase('Paused');
    }
  };

  const resetBreathing = () => {
    setBreathingActive(false);
    setBreathPhase('Ready');
    setBreathTimer(4);
    setCycleCount(0);
  };

  const filtered = recommendations.filter(
    (r) => activeCategory === 'all' || r.category === activeCategory
  );

  return (
    <div style={{ padding: '3rem 0', minHeight: '80vh' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2.5rem auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#e0f2fe', color: '#0284c7', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            <Sparkles size={15} />
            <span>Evidence-Based Self-Care</span>
          </div>
          <h1 style={{ fontSize: '2.15rem', color: '#0f172a', marginBottom: '0.5rem' }}>
            Stress Management & Recovery Protocols
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Engage with interactive breathwork, somatic relaxation techniques, time structuring routines, and psychoeducational resources.
          </p>
        </div>

        {/* Interactive 4-7-8 Breathing Circle Widget */}
        <div className="card" style={{
          background: 'radial-gradient(circle at center, #ffffff 0%, #f0fdfa 100%)',
          border: '2px solid #bae6fd',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          marginBottom: '3rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Interactive Somatic Practice
          </span>
          <h2 style={{ fontSize: '1.75rem', marginTop: '0.25rem', color: '#0f172a' }}>
            4-7-8 Parasympathetic Reset
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto 1.5rem auto' }}>
            Inhale deeply through your nose for 4 seconds, gently hold for 7 seconds, and exhale slowly through your mouth for 8 seconds.
          </p>

          {/* Breathing Visual Sphere */}
          <div
            style={{
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              margin: '0 auto 1.5rem auto',
              background:
                breathPhase === 'Inhale'
                  ? 'radial-gradient(circle, rgba(14, 165, 233, 0.4) 0%, rgba(2, 132, 199, 0.15) 70%)'
                  : breathPhase === 'Hold'
                  ? 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(99, 102, 241, 0.15) 70%)'
                  : 'radial-gradient(circle, rgba(13, 148, 136, 0.4) 0%, rgba(13, 148, 136, 0.15) 70%)',
              border: `3px solid ${breathPhase === 'Hold' ? '#6366f1' : breathPhase === 'Inhale' ? '#0284c7' : '#0d9488'}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transform: breathPhase === 'Inhale' ? 'scale(1.25)' : breathPhase === 'Hold' ? 'scale(1.25)' : 'scale(1)',
              transition: breathPhase === 'Inhale' ? 'transform 4s ease-out' : breathPhase === 'Exhale' ? 'transform 8s ease-in' : 'transform 0.5s ease',
              boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.25)'
            }}
          >
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {breathPhase}
            </span>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0284c7', lineHeight: 1, marginTop: '0.25rem' }}>
              {breathTimer}s
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <button
              onClick={toggleBreathing}
              className="btn btn-primary"
              style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
            >
              {breathingActive ? <Pause size={18} /> : <Play size={18} />}
              {breathingActive ? 'Pause Exercise' : 'Start 4-7-8 Breathing'}
            </button>
            <button
              onClick={resetBreathing}
              className="btn btn-secondary"
              style={{ padding: '0.75rem', borderRadius: '10px' }}
              title="Reset"
            >
              <RotateCcw size={18} />
            </button>
          </div>

          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Completed Cycles: <strong>{cycleCount}</strong> • 4 cycles provide significant vagus nerve stimulation
          </span>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2.5rem' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              style={{
                padding: '0.55rem 1.15rem',
                borderRadius: '9999px',
                border: activeCategory === cat.key ? '1px solid #0284c7' : '1px solid var(--border)',
                backgroundColor: activeCategory === cat.key ? '#0284c7' : '#ffffff',
                color: activeCategory === cat.key ? '#ffffff' : '#475569',
                fontWeight: activeCategory === cat.key ? 700 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Protocols Grid */}
        <div className="grid-3" style={{ marginBottom: '3.5rem' }}>
          {filtered.map((item) => (
            <div key={item._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'capitalize'
                  }}>
                    {item.category.replace('_', ' ')}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={13} /> {item.durationMinutes} min
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: '#0f172a' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {item.description}
                </p>

                {item.steps && item.steps.length > 0 && (
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                      Step-by-Step Instructions:
                    </span>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: '#334155' }}>
                      {item.steps.map((s, idx) => (
                        <li key={idx} style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                          <span style={{ color: '#0284c7', fontWeight: 700 }}>{idx + 1}.</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Target: {item.stressLevelTarget?.join(', ')}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                  Ready to Practice
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Psychoeducation Articles Section */}
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.45rem', color: '#0f172a', marginBottom: '0.25rem' }}>
              Psychoeducational Articles & Clinical Guides
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Deep dive into the science of stress, cognitive reframing, and mental wellness.
            </p>
          </div>

          <div className="grid-2">
            {resources.map((res) => (
              <div key={res._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#334155', textTransform: 'capitalize' }}>
                    {res.category}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {res.readTimeMinutes} min read • By {res.author}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#0f172a' }}>
                  {res.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                  {res.summary}
                </p>
                {res.content && (
                  <p style={{ fontSize: '0.825rem', color: '#64748b', fontStyle: 'italic', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '8px', lineHeight: 1.5 }}>
                    "{res.content}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default RecommendationsPage;
