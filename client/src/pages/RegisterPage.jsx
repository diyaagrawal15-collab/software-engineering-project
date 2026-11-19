import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, User, Mail, Lock, Briefcase, Award, AlertCircle, CheckCircle2 } from 'lucide-react';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('user'); // 'user' or 'counselor'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [occupation, setOccupation] = useState('');
  const [age, setAge] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [experience, setExperience] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name,
        email,
        password,
        role,
        occupation,
        age: age ? Number(age) : undefined,
      };

      if (role === 'counselor') {
        payload.specialization = specialization;
        payload.qualifications = qualifications;
        payload.experience = experience ? Number(experience) : 0;
      }

      const res = await register(payload);
      if (res.success) {
        if (role === 'counselor') {
          navigate('/counselor');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3.5rem 0', minHeight: 'calc(100vh - 140px)', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '540px' }}>
        
        <div className="card" style={{ padding: '2.5rem' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
              color: '#fff',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
            }}>
              <Heart size={24} fill="#ffffff" />
            </div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>Create Account</h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Begin your journey toward balanced mental health</p>
          </div>

          {/* Role Toggle Tabs */}
          <div style={{
            display: 'flex',
            backgroundColor: '#f1f5f9',
            borderRadius: '10px',
            padding: '4px',
            marginBottom: '1.5rem'
          }}>
            <button
              type="button"
              onClick={() => setRole('user')}
              style={{
                flex: 1,
                padding: '0.65rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                backgroundColor: role === 'user' ? '#ffffff' : 'transparent',
                color: role === 'user' ? '#0284c7' : '#64748b',
                boxShadow: role === 'user' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              Wellness Seeker (User)
            </button>
            <button
              type="button"
              onClick={() => setRole('counselor')}
              style={{
                flex: 1,
                padding: '0.65rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                backgroundColor: role === 'counselor' ? '#ffffff' : 'transparent',
                color: role === 'counselor' ? '#0d9488' : '#64748b',
                boxShadow: role === 'counselor' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              Certified Counselor
            </button>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  required
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="e.g. Diya Agrawal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="email"
                  required
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Password (Min 6 chars)</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Occupation / Profession</label>
                <div style={{ position: 'relative' }}>
                  <Briefcase size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="e.g. Student, Engineer"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Additional Counselor Fields */}
            {role === 'counselor' && (
              <div style={{
                backgroundColor: '#f0fdfa',
                border: '1px solid #ccfbf1',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1.25rem'
              }}>
                <h4 style={{ fontSize: '0.95rem', color: '#0f766e', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Award size={18} />
                  Professional Qualifications
                </h4>

                <div className="form-group">
                  <label className="form-label">Primary Specialization</label>
                  <input
                    type="text"
                    required={role === 'counselor'}
                    className="form-input"
                    placeholder="e.g. CBT, Workplace Burnout, Anxiety"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Degrees & Certifications</label>
                    <input
                      type="text"
                      required={role === 'counselor'}
                      className="form-input"
                      placeholder="e.g. M.Phil Clinical Psych"
                      value={qualifications}
                      onChange={(e) => setQualifications(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Experience (Years)</label>
                    <input
                      type="number"
                      min={0}
                      className="form-input"
                      placeholder="e.g. 5"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem', fontSize: '1rem' }}
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 700, color: 'var(--primary)' }}>
              Sign In
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
