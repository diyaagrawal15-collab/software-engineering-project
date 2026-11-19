import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Activity,
  BookOpen,
  Sparkles,
  Calendar,
  BarChart2,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
  Smile,
  Compass,
  Users,
} from 'lucide-react';

const LandingPage = ({ onOpenCrisisModal }) => {
  return (
    <div style={{ paddingBottom: '3rem' }}>
      
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(180deg, #e0f2fe 0%, #f0fdfa 60%, #f8fafc 100%)',
        padding: '5rem 0 4rem 0',
        borderBottom: '1px solid var(--border)'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '860px' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#ffffff',
            border: '1px solid #bae6fd',
            borderRadius: '9999px',
            padding: '0.35rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#0284c7',
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Sparkles size={16} />
            <span>Scientifically Informed Stress Evaluation & Personal Recovery</span>
          </div>

          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem', letterSpacing: '-1px', lineHeight: 1.15 }}>
            Understand Your Stress. <br />
            <span style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Reclaim Your Inner Calm.
            </span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: '#475569', lineHeight: 1.7, marginBottom: '2.25rem' }}>
            A comprehensive, clinically informed wellness platform. Evaluate your stress levels using the validated PSS-10 methodology, record daily moods, practice interactive breathwork, and connect with licensed counselors.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <Link to="/assessment" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
              <Activity size={18} />
              Take Free Stress Assessment
            </Link>
            <Link to="/appointments" className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
              <Calendar size={18} />
              Book Counselor Session
            </Link>
          </div>

          {/* Quick Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0284c7' }}>PSS-10</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Validated Scoring Scale</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0d9488' }}>100% Private</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Encrypted & User-Controlled</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#6366f1' }}>4-7-8 & Box</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Guided Somatic Breathwork</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>24/7 Support</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Integrated Crisis Safety</div>
            </div>
          </div>

        </div>
      </section>

      {/* Stress Classification Overview */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#ffffff', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem auto' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Structured Methodology
            </span>
            <h2 style={{ fontSize: '2.15rem', marginTop: '0.4rem', color: '#0f172a' }}>
              Three-Tier Stress Evaluation Model
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Your responses are analyzed across emotional, cognitive, physical, and behavioral dimensions to categorize stress severity.
            </p>
          </div>

          <div className="grid-3">
            
            {/* Low Stress */}
            <div className="card" style={{ borderTop: '4px solid #10b981' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="badge badge-low">Score 0 – 13</span>
                <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700 }}>Balanced</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#065f46' }}>Low Perceived Stress</h3>
              <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1rem' }}>
                You possess high psychological coping resilience. Daily demands are well-regulated with healthy routines and emotional clarity.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.825rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <CheckCircle2 size={15} color="#10b981" /> Maintain circadian sleep habits
                </li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <CheckCircle2 size={15} color="#10b981" /> Daily gratitude reflection
                </li>
              </ul>
            </div>

            {/* Moderate Stress */}
            <div className="card" style={{ borderTop: '4px solid #f59e0b' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="badge badge-moderate">Score 14 – 26</span>
                <span style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 700 }}>Manageable Pressure</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#92400e' }}>Moderate Stress</h3>
              <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1rem' }}>
                You are experiencing noticeable cognitive and emotional pressures. Early intervention stops escalation into chronic burnout.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.825rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <CheckCircle2 size={15} color="#f59e0b" /> Box breathing micro-breaks
                </li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <CheckCircle2 size={15} color="#f59e0b" /> Task boundary & Pomodoro pacing
                </li>
              </ul>
            </div>

            {/* High Stress */}
            <div className="card" style={{ borderTop: '4px solid #ef4444' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="badge badge-high">Score 27 – 40</span>
                <span style={{ fontSize: '0.8rem', color: '#b91c1c', fontWeight: 700 }}>Action Required</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#991b1b' }}>High Stress</h3>
              <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1rem' }}>
                Demands substantially exceed perceived coping resources. High risk of sleep disturbances, physical fatigue, and emotional burnout.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.825rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <CheckCircle2 size={15} color="#ef4444" /> Grounding 5-4-3-2-1 intervention
                </li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <CheckCircle2 size={15} color="#ef4444" /> 1-on-1 counselor guidance
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 6 Key Modules Grid */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem auto' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0d9488', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Integrated Ecosystem
            </span>
            <h2 style={{ fontSize: '2.15rem', marginTop: '0.4rem', color: '#0f172a' }}>
              Every Tool You Need in One Unified Platform
            </h2>
          </div>

          <div className="grid-3">
            
            <div className="card">
              <div style={{ background: '#e0f2fe', color: '#0284c7', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Activity size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Structured PSS-10 Assessment</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                10 scientifically formulated questions with reverse-scoring controls to accurately quantify perceived psychological stress.
              </p>
            </div>

            <div className="card">
              <div style={{ background: '#ccfbf1', color: '#0d9488', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <BookOpen size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Daily Mood Journaling</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Log mood intensity, sleep hours, environmental triggers, and private reflective notes to reveal emotional cycles over time.
              </p>
            </div>

            <div className="card">
              <div style={{ background: '#e0e7ff', color: '#6366f1', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Interactive Breathwork & Self-Care</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Engage in animated real-time 4-7-8 breathing guides, progressive muscle relaxation walkthroughs, and focus management tools.
              </p>
            </div>

            <div className="card">
              <div style={{ background: '#fef3c7', color: '#d97706', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Calendar size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Verified Counselor Consultations</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Browse verified clinical psychologists, select convenient appointment dates, and receive personalized advice notes.
              </p>
            </div>

            <div className="card">
              <div style={{ background: '#dcfce7', color: '#16a34a', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <BarChart2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Longitudinal Progress Reports</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Visualize your stress scores and mood trajectory across weeks with comparison metrics and exportable summaries.
              </p>
            </div>

            <div className="card">
              <div style={{ background: '#fee2e2', color: '#dc2626', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <PhoneCall size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Immediate Safety & Crisis Helplines</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Instant access to 24/7 toll-free national psychological first-aid lines (Tele-MANAS, KIRAN, Vandrevala Foundation).
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="container">
        <div style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '3.5rem 2rem',
          color: '#ffffff',
          textAlign: 'center',
          boxShadow: '0 20px 25px -5px rgba(2, 132, 199, 0.3)'
        }}>
          <h2 style={{ color: '#ffffff', fontSize: '2.25rem', marginBottom: '1rem' }}>
            Ready to Take Control of Your Well-being?
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 2rem auto', fontSize: '1.05rem', color: '#e0f2fe' }}>
            Join thousands evaluating their mental health balance with privacy, evidence-based tools, and certified clinical guidance.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn" style={{ backgroundColor: '#ffffff', color: '#0284c7', padding: '0.85rem 2rem', fontWeight: 700 }}>
              Create Free Account
            </Link>
            <Link to="/assessment" className="btn btn-outline" style={{ borderColor: '#ffffff', color: '#ffffff' }}>
              Take Assessment Now
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
