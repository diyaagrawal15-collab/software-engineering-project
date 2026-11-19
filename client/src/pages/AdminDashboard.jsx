import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import {
  Shield,
  Users,
  Activity,
  Calendar,
  BookOpen,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  FileText,
  PhoneCall,
  UserCheck,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [resources, setResources] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'resources'
  const [loading, setLoading] = useState(true);

  // New Resource Modal State
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [resourceType, setResourceType] = useState('article');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('burnout');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [savingResource, setSavingResource] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, resRes] = await Promise.all([
        adminService.getStats(),
        adminService.getAllUsers(),
        adminService.getResources(),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (usersRes.data.success) setUsers(usersRes.data.data);
      if (resRes.data.success) setResources(resRes.data.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUser(userId, { role: newRole });
      await fetchData();
    } catch (err) {
      alert('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) return;
    try {
      await adminService.deleteUser(userId);
      await fetchData();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const handleCreateResource = async (e) => {
    e.preventDefault();
    setSavingResource(true);
    try {
      await adminService.createResource({
        title,
        type: resourceType,
        category,
        summary,
        content,
        contactNumber,
        isEmergency: resourceType === 'helpline',
      });
      setIsResourceModalOpen(false);
      setTitle('');
      setSummary('');
      setContent('');
      setContactNumber('');
      await fetchData();
    } catch (err) {
      alert('Failed to publish resource');
    } finally {
      setSavingResource(false);
    }
  };

  const handleDeleteResource = async (id) => {
    if (!window.confirm('Delete this resource?')) return;
    try {
      await adminService.deleteResource(id);
      await fetchData();
    } catch (err) {
      alert('Failed to delete resource');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <p style={{ color: '#64748b' }}>Loading administrative dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0', minHeight: '80vh' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#fee2e2', color: '#dc2626', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              <Shield size={15} />
              <span>System Administration</span>
            </div>
            <h1 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '0.35rem' }}>
              Platform Operations Control Center
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Oversee users, counselor verifications, assessments, and clinical educational resources.
            </p>
          </div>

          {/* Tab Selector */}
          <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '10px', padding: '4px' }}>
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                backgroundColor: activeTab === 'overview' ? '#ffffff' : 'transparent',
                color: activeTab === 'overview' ? '#dc2626' : '#64748b',
                boxShadow: activeTab === 'overview' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              System Stats
            </button>
            <button
              onClick={() => setActiveTab('users')}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                backgroundColor: activeTab === 'users' ? '#ffffff' : 'transparent',
                color: activeTab === 'users' ? '#dc2626' : '#64748b',
                boxShadow: activeTab === 'users' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              Users & Counselors ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                backgroundColor: activeTab === 'resources' ? '#ffffff' : 'transparent',
                color: activeTab === 'resources' ? '#dc2626' : '#64748b',
                boxShadow: activeTab === 'resources' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              Resources & Content ({resources.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Overview Stats */}
        {activeTab === 'overview' && stats && (
          <div>
            <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
              <div className="card">
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Active Users</span>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0284c7' }}>{stats.totalUsers}</div>
              </div>
              <div className="card">
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Verified Counselors</span>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0d9488' }}>{stats.totalCounselors}</div>
              </div>
              <div className="card">
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Assessments Evaluated</span>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#6366f1' }}>{stats.totalAssessments}</div>
              </div>
              <div className="card">
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Counseling Bookings</span>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#f59e0b' }}>{stats.totalAppointments}</div>
              </div>
            </div>

            {/* Stress Distribution */}
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#0f172a' }}>
                System-Wide Stress Severity Distribution
              </h3>
              <div className="grid-3">
                <div style={{ padding: '1rem', borderRadius: '10px', backgroundColor: '#d1fae5', border: '1px solid #a7f3d0' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#065f46' }}>Low Stress Cases</span>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#065f46' }}>
                    {stats.stressDistribution.low}
                  </div>
                </div>
                <div style={{ padding: '1rem', borderRadius: '10px', backgroundColor: '#fef3c7', border: '1px solid #fde68a' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#92400e' }}>Moderate Stress Cases</span>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#92400e' }}>
                    {stats.stressDistribution.moderate}
                  </div>
                </div>
                <div style={{ padding: '1rem', borderRadius: '10px', backgroundColor: '#fee2e2', border: '1px solid #fecaca' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#991b1b' }}>High Stress Cases</span>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#991b1b' }}>
                    {stats.stressDistribution.high}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: User Management Table */}
        {activeTab === 'users' && (
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: '#0f172a' }}>
              Registered Platform Users ({users.length})
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', color: '#64748b' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Name & Email</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Current Role</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Occupation / Credentials</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Registered Date</th>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{u.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.email}</div>
                      </td>

                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        <span className="badge" style={{
                          backgroundColor: u.role === 'admin' ? '#fee2e2' : u.role === 'counselor' ? '#ccfbf1' : '#e0f2fe',
                          color: u.role === 'admin' ? '#991b1b' : u.role === 'counselor' ? '#0f766e' : '#0369a1',
                        }}>
                          {u.role}
                        </span>
                      </td>

                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        {u.role === 'counselor' ? (
                          <span style={{ fontSize: '0.8rem', color: '#0d9488' }}>{u.specialization || 'Clinical Counselor'}</span>
                        ) : (
                          <span>{u.occupation || 'Standard User'}</span>
                        )}
                      </td>

                      <td style={{ padding: '0.85rem 0.5rem', color: '#94a3b8', fontSize: '0.8rem' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            style={{ padding: '0.3rem 0.5rem', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.78rem' }}
                          >
                            <option value="user">User</option>
                            <option value="counselor">Counselor</option>
                            <option value="admin">Admin</option>
                          </select>

                          {u.role !== 'admin' && (
                            <button
                              onClick={() => handleDeleteUser(u._id, u.name)}
                              style={{ background: 'transparent', color: '#ef4444', padding: '0.3rem' }}
                              title="Delete User"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Resource Management */}
        {activeTab === 'resources' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>
                Educational Articles & Helpline Content
              </h3>
              <button
                onClick={() => setIsResourceModalOpen(true)}
                className="btn btn-primary"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.875rem' }}
              >
                <Plus size={16} />
                Publish New Content
              </button>
            </div>

            <div className="grid-2">
              {resources.map((res) => (
                <div key={res._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span className="badge" style={{ backgroundColor: res.isEmergency ? '#fee2e2' : '#f1f5f9', color: res.isEmergency ? '#dc2626' : '#334155' }}>
                        {res.type.toUpperCase()} • {res.category}
                      </span>
                      <button
                        onClick={() => handleDeleteResource(res._id)}
                        style={{ background: 'transparent', color: '#ef4444', padding: '0.25rem' }}
                        title="Delete Resource"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '0.35rem' }}>
                      {res.title}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                      {res.summary}
                    </p>

                    {res.contactNumber && (
                      <div style={{ fontWeight: 700, color: '#dc2626', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        📞 Helpline: {res.contactNumber}
                      </div>
                    )}
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                    Author: {res.author} • Added on {new Date(res.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Resource Modal */}
        {isResourceModalOpen && (
          <div className="modal-overlay" onClick={() => setIsResourceModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>
                  Publish Educational or Helpline Resource
                </h3>
                <button onClick={() => setIsResourceModalOpen(false)} style={{ background: 'transparent', color: '#64748b' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateResource}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <select className="form-select" value={resourceType} onChange={(e) => setResourceType(e.target.value)}>
                      <option value="article">Article</option>
                      <option value="helpline">Helpline</option>
                      <option value="guide">Guide</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option value="burnout">Burnout</option>
                      <option value="anxiety">Anxiety</option>
                      <option value="mindfulness">Mindfulness</option>
                      <option value="crisis">Crisis Support</option>
                      <option value="sleep">Sleep</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Resource Title *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Recognizing Workplace Burnout"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {resourceType === 'helpline' && (
                  <div className="form-group">
                    <label className="form-label">Contact / Helpline Number</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 1800-XXX-XXXX"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Summary / Overview *</label>
                  <textarea
                    required
                    rows={2}
                    className="form-textarea"
                    placeholder="Brief 1-2 sentence overview..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Full Content</label>
                  <textarea
                    rows={4}
                    className="form-textarea"
                    placeholder="Detailed explanation, steps, or clinical insight..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="submit" disabled={savingResource} className="btn btn-primary" style={{ flex: 1 }}>
                    {savingResource ? 'Publishing...' : 'Publish Content'}
                  </button>
                  <button type="button" onClick={() => setIsResourceModalOpen(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
