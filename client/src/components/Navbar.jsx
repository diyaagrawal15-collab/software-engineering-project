import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Heart,
  Activity,
  BookOpen,
  Sparkles,
  Calendar,
  BarChart2,
  Shield,
  UserCheck,
  User,
  LogOut,
  Menu,
  X,
  PhoneCall,
  MessageCircle,
} from 'lucide-react';

const Navbar = ({ onOpenCrisisModal }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
            color: '#fff',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(2, 132, 199, 0.25)'
          }}>
            <Heart size={20} fill="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
              Stress<span style={{ color: '#0284c7' }}>Care</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Evaluation & Management
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        {isAuthenticated && (
          <div style={{ display: 'none', gap: '1.25rem', alignItems: 'center' }} className="d-md-flex">
            <Link
              to="/dashboard"
              style={{
                color: isActive('/dashboard') ? 'var(--primary)' : '#475569',
                fontWeight: 600,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Activity size={17} />
              Dashboard
            </Link>

            <Link
              to="/assessment"
              style={{
                color: isActive('/assessment') ? 'var(--primary)' : '#475569',
                fontWeight: 600,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Activity size={17} />
              Stress Assessment
            </Link>

            <Link
              to="/mood"
              style={{
                color: isActive('/mood') ? 'var(--primary)' : '#475569',
                fontWeight: 600,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <BookOpen size={17} />
              Mood Journal
            </Link>

            <Link
              to="/recommendations"
              style={{
                color: isActive('/recommendations') ? 'var(--primary)' : '#475569',
                fontWeight: 600,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Sparkles size={17} />
              Self-Care
            </Link>

            <Link
              to="/appointments"
              style={{
                color: isActive('/appointments') ? 'var(--primary)' : '#475569',
                fontWeight: 600,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Calendar size={17} />
              Counselors
            </Link>

            <Link
              to="/reports"
              style={{
                color: isActive('/reports') ? 'var(--primary)' : '#475569',
                fontWeight: 600,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <BarChart2 size={17} />
              Reports
            </Link>

            {user?.role === 'counselor' && (
              <Link
                to="/counselor"
                style={{
                  background: 'var(--secondary-light)',
                  color: 'var(--secondary)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <UserCheck size={16} />
                Counselor Portal
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                style={{
                  background: '#fef2f2',
                  color: '#dc2626',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Shield size={16} />
                Admin Panel
              </Link>
            )}
          </div>
        )}

        {/* Right Side Action / Auth Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          
          {/* 24/7 Helpline Quick Pill */}
          <button
            onClick={onOpenCrisisModal}
            className="btn"
            style={{
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              padding: '0.45rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              borderRadius: '9999px',
              border: '1px solid #fecaca'
            }}
            title="Immediate 24/7 Crisis Helplines"
          >
            <PhoneCall size={14} />
            <span style={{ display: 'none' }} className="d-sm-inline">24/7 Helplines</span>
          </button>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '8px',
                  backgroundColor: '#f1f5f9',
                  color: '#334155',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}
              >
                <User size={16} />
                <span style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name?.split(' ')[0]}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'flex', background: 'transparent', padding: '0.25rem', color: '#475569' }}
            className="d-md-none"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border)', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }} className="d-md-none">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              <Link to="/assessment" onClick={() => setMobileMenuOpen(false)}>Stress Assessment</Link>
              <Link to="/mood" onClick={() => setMobileMenuOpen(false)}>Mood Journal</Link>
              <Link to="/recommendations" onClick={() => setMobileMenuOpen(false)}>Self-Care & Breathing</Link>
              <Link to="/appointments" onClick={() => setMobileMenuOpen(false)}>Book Counselor</Link>
              <Link to="/reports" onClick={() => setMobileMenuOpen(false)}>Progress Reports</Link>
              {user?.role === 'counselor' && <Link to="/counselor" onClick={() => setMobileMenuOpen(false)}>Counselor Portal</Link>}
              {user?.role === 'admin' && <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin Panel</Link>}
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>My Profile</Link>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>Log Out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Create Free Account</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
