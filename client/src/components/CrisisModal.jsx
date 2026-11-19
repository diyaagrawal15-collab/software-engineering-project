import React from 'react';
import { PhoneCall, ShieldAlert, X, Heart, ExternalLink } from 'lucide-react';

const HELPLINES = [
  {
    name: 'Tele-MANAS (Govt. of India)',
    number: '14416',
    altNumber: '1800 891 4416',
    timing: '24/7 Free & Confidential',
    desc: 'National tele mental health programme providing counseling across 20+ Indian languages.',
  },
  {
    name: 'KIRAN Mental Health Rehabilitation',
    number: '1800 599 0019',
    timing: '24/7 Toll-Free',
    desc: 'Support for stress, anxiety, depression, adjustment disorders, and mental health emergencies.',
  },
  {
    name: 'Vandrevala Foundation Helpline',
    number: '+91 9999 666 555',
    timing: '24/7 Free Assistance',
    desc: 'Experienced crisis counselors offering psychological first aid and emotional support.',
  },
  {
    name: 'National Emergency Response System',
    number: '112',
    timing: '24/7 Immediate Dispatch',
    desc: 'For immediate medical, police, or physical emergency response anywhere in India.',
  },
];

const CrisisModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ backgroundColor: '#fee2e2', padding: '0.5rem', borderRadius: '10px', color: '#dc2626' }}>
              <ShieldAlert size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#991b1b', margin: 0 }}>Immediate 24/7 Crisis Support</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>You are not alone. Free, confidential help is available right now.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', color: '#64748b', padding: '0.25rem' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Reassurance Banner */}
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center'
        }}>
          <Heart size={22} style={{ color: '#16a34a', flexShrink: 0 }} />
          <p style={{ fontSize: '0.875rem', color: '#166534', margin: 0 }}>
            If you are feeling overwhelmed, having thoughts of self-harm, or in acute emotional pain, please take a deep breath and connect with a trained professional counselor below.
          </p>
        </div>

        {/* Helplines List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
          {HELPLINES.map((h, i) => (
            <div
              key={i}
              style={{
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '1rem',
                backgroundColor: '#ffffff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.2rem 0' }}>
                  {h.name}
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 0.25rem 0' }}>
                  {h.desc}
                </p>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669', backgroundColor: '#ecfdf5', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  {h.timing}
                </span>
              </div>
              <a
                href={`tel:${h.number.replace(/\s+/g, '')}`}
                className="btn btn-primary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', textDecoration: 'none' }}
              >
                <PhoneCall size={15} />
                Call {h.number}
              </a>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div style={{ textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
            StressCare provides psychological self-evaluation and stress wellness tools. It does not replace medical emergencies or direct psychiatric evaluation.
          </p>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ marginTop: '0.75rem', padding: '0.5rem 1.5rem' }}
          >
            Close Dialog
          </button>
        </div>

      </div>
    </div>
  );
};

export default CrisisModal;
