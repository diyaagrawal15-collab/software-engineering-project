import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, PhoneCall, Sparkles } from 'lucide-react';

const Footer = ({ onOpenCrisisModal }) => {
  return (
    <footer style={{
      backgroundColor: '#ffffff',
      borderTop: '1px solid var(--border)',
      padding: '3rem 0 2rem 0',
      marginTop: 'auto'
    }}>
      <div className="container">
        
        {/* Top Disclaimer Banner */}
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '1.25rem 1.5rem',
          marginBottom: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          fontSize: '0.85rem',
          color: '#475569'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontWeight: 700 }}>
            <ShieldCheck size={18} style={{ color: '#0284c7' }} />
            <span>Important Medical & Clinical Disclaimer</span>
          </div>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            The Stress Evaluation and Management System is an evidence-informed self-reflection and personal wellness tool utilizing the standardized Perceived Stress Scale (PSS-10). It is strictly designed for educational awareness, stress tracking, and lifestyle self-care. <strong>It does not constitute a clinical psychiatric diagnosis, medical advice, or formal psychotherapy.</strong>
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '0.25rem' }}>
            <span>Need immediate emergency support?</span>
            <button
              onClick={onOpenCrisisModal}
              style={{
                background: 'none',
                border: 'none',
                color: '#dc2626',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                textDecoration: 'underline',
                padding: 0
              }}
            >
              <PhoneCall size={14} />
              Tele-MANAS (14416) & 24/7 Helplines
            </button>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ background: '#0284c7', color: '#fff', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={18} fill="#ffffff" />
              </div>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                Stress<span style={{ color: '#0284c7' }}>Care</span>
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>
              Empowering individuals with evidence-based stress assessment, reflective mood journaling, actionable breathing protocols, and verified counseling support.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#334155', marginBottom: '1rem' }}>
              Wellness Tools
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <Link to="/assessment" style={{ color: '#64748b' }}>PSS-10 Stress Evaluation</Link>
              <Link to="/mood" style={{ color: '#64748b' }}>Daily Mood Journal</Link>
              <Link to="/recommendations" style={{ color: '#64748b' }}>4-7-8 & Box Breathing</Link>
              <Link to="/recommendations" style={{ color: '#64748b' }}>Somatic Relaxation</Link>
              <Link to="/reports" style={{ color: '#64748b' }}>Personal Progress Reports</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#334155', marginBottom: '1rem' }}>
              Support & Care
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <Link to="/appointments" style={{ color: '#64748b' }}>Verified Wellness Counselors</Link>
              <button onClick={onOpenCrisisModal} style={{ background: 'none', border: 'none', textAlign: 'left', padding: 0, color: '#64748b', cursor: 'pointer', font: 'inherit' }}>
                24/7 National Crisis Numbers
              </button>
              <Link to="/profile" style={{ color: '#64748b' }}>Account & Privacy Settings</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#334155', marginBottom: '1rem' }}>
              Platform Status
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontWeight: 600 }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
                All Systems Operational
              </div>
              <span>Atlas Cloud Cluster Active</span>
              <span>End-to-End JWT Security</span>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: '#94a3b8'
        }}>
          <div>
            © {new Date().getFullYear()} StressCare System. All rights reserved.
          </div>
          <div>
            Crafted for Stress Evaluation and Management
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
