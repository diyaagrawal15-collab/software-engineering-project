import React, { useState, useEffect } from 'react';
import { counselorService, appointmentService } from '../services/api';
import {
  UserCheck,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  User,
  Activity,
  AlertCircle,
  Video,
  X,
  MessageSquare,
} from 'lucide-react';

const CounselorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Selected Patient Modal
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(false);

  // Status update modal / advice
  const [activeApptToUpdate, setActiveApptToUpdate] = useState(null);
  const [newStatus, setNewStatus] = useState('accepted');
  const [adviceText, setAdviceText] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dashRes, apptRes] = await Promise.all([
        counselorService.getDashboard(),
        appointmentService.getMyAppointments(),
      ]);

      if (dashRes.data.success) {
        setStats(dashRes.data.stats);
      }
      if (apptRes.data.success) {
        setAppointments(apptRes.data.data);
      }
    } catch (err) {
      setError('Failed to load counselor dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openPatientModal = async (userObj) => {
    setSelectedPatient(userObj);
    setLoadingPatient(true);
    try {
      const res = await counselorService.getPatientDetails(userObj._id);
      if (res.data.success) {
        setPatientData(res.data);
      }
    } catch (err) {
      console.error('Error fetching patient details:', err);
    } finally {
      setLoadingPatient(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!activeApptToUpdate) return;

    setUpdating(true);
    try {
      await appointmentService.updateStatus(activeApptToUpdate._id, {
        status: newStatus,
        counselorAdvice: adviceText.trim(),
      });
      setActiveApptToUpdate(null);
      setAdviceText('');
      await fetchData();
    } catch (err) {
      alert('Failed to update appointment status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <p style={{ color: '#64748b' }}>Loading counselor schedule and consultations...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0', minHeight: '80vh' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#ccfbf1', color: '#0d9488', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            <UserCheck size={15} />
            <span>Accredited Counselor Workspace</span>
          </div>
          <h1 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '0.35rem' }}>
            Counselor Consultation Management
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Manage client appointments, review psychological evaluation history, and provide structured self-care advice.
          </p>
        </div>

        {/* Stats Row */}
        {stats && (
          <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
            <div className="card">
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Total Assigned</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{stats.totalAppointments}</div>
            </div>
            <div className="card">
              <span style={{ fontSize: '0.8rem', color: '#92400e', fontWeight: 600 }}>Pending Review</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b' }}>{stats.pendingRequests}</div>
            </div>
            <div className="card">
              <span style={{ fontSize: '0.8rem', color: '#065f46', fontWeight: 600 }}>Accepted Sessions</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>{stats.acceptedAppointments}</div>
            </div>
            <div className="card">
              <span style={{ fontSize: '0.8rem', color: '#0369a1', fontWeight: 600 }}>Completed</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0284c7' }}>{stats.completedAppointments}</div>
            </div>
          </div>
        )}

        {/* Appointments List */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: '#0f172a' }}>
            Client Appointment Requests ({appointments.length})
          </h3>

          {appointments.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', color: '#64748b' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Client</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Schedule</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Stress Level</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Reason</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt) => (
                    <tr key={appt._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{appt.user?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {appt.user?.email} • {appt.user?.occupation || 'User'}
                        </div>
                      </td>

                      <td style={{ padding: '1rem 0.5rem' }}>
                        <div style={{ fontWeight: 600 }}>{new Date(appt.appointmentDate).toLocaleDateString()}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{appt.timeSlot}</div>
                      </td>

                      <td style={{ padding: '1rem 0.5rem' }}>
                        <span className={`badge badge-${appt.stressLevelAtBooking?.toLowerCase() || 'pending'}`}>
                          {appt.stressLevelAtBooking || 'Not Assessed'}
                        </span>
                      </td>

                      <td style={{ padding: '1rem 0.5rem', maxWidth: '240px' }}>
                        <p style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={appt.reason}>
                          {appt.reason}
                        </p>
                      </td>

                      <td style={{ padding: '1rem 0.5rem' }}>
                        <span className={`badge badge-${appt.status}`}>
                          {appt.status}
                        </span>
                      </td>

                      <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => openPatientModal(appt.user)}
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                            title="View Client Assessment History"
                          >
                            <FileText size={14} /> History
                          </button>

                          <button
                            onClick={() => {
                              setActiveApptToUpdate(appt);
                              setNewStatus(appt.status === 'pending' ? 'accepted' : appt.status);
                              setAdviceText(appt.counselorAdvice || '');
                            }}
                            className="btn btn-primary"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                          >
                            Manage
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <Calendar size={36} style={{ color: '#94a3b8', margin: '0 auto 0.75rem auto' }} />
              <p style={{ color: '#64748b' }}>No client appointments assigned yet.</p>
            </div>
          )}
        </div>

        {/* Manage Appointment Status Modal */}
        {activeApptToUpdate && (
          <div className="modal-overlay" onClick={() => setActiveApptToUpdate(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>
                  Update Consultation Status
                </h3>
                <button onClick={() => setActiveApptToUpdate(null)} style={{ background: 'transparent', color: '#64748b' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdateStatus}>
                <div className="form-group">
                  <label className="form-label">Client Name</label>
                  <input type="text" disabled className="form-input" value={activeApptToUpdate.user?.name} />
                </div>

                <div className="form-group">
                  <label className="form-label">Update Session Status</label>
                  <select
                    className="form-select"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted (Confirmed)</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Counselor Advice & Session Guidance Notes</label>
                  <textarea
                    rows={4}
                    className="form-textarea"
                    placeholder="Provide supportive advice, recommended breathwork practices, or follow-up suggestions for the client..."
                    value={adviceText}
                    onChange={(e) => setAdviceText(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="submit" disabled={updating} className="btn btn-primary" style={{ flex: 1 }}>
                    {updating ? 'Saving...' : 'Save Updates'}
                  </button>
                  <button type="button" onClick={() => setActiveApptToUpdate(null)} className="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Patient Wellness History Modal */}
        {selectedPatient && (
          <div className="modal-overlay" onClick={() => setSelectedPatient(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>
                    Clinical Profile: {selectedPatient.name}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {selectedPatient.email} • {selectedPatient.age ? `${selectedPatient.age} yrs` : ''} • {selectedPatient.occupation}
                  </span>
                </div>
                <button onClick={() => setSelectedPatient(null)} style={{ background: 'transparent', color: '#64748b' }}>
                  <X size={20} />
                </button>
              </div>

              {loadingPatient ? (
                <p style={{ textAlign: 'center', padding: '2rem' }}>Loading wellness records...</p>
              ) : patientData ? (
                <div>
                  {/* Assessments history */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.95rem', color: '#0284c7', marginBottom: '0.75rem', fontWeight: 700 }}>
                      Recent Stress Assessments (PSS-10)
                    </h4>
                    {patientData.recentAssessments?.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {patientData.recentAssessments.map((a) => (
                          <div key={a._id} style={{ padding: '0.65rem 0.85rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <span className={`badge badge-${a.stressLevel.toLowerCase()}`} style={{ marginRight: '0.5rem' }}>
                                {a.stressLevel} ({a.totalScore}/40)
                              </span>
                              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                {new Date(a.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                              E:{a.categoryBreakdown.emotional} C:{a.categoryBreakdown.cognitive} P:{a.categoryBreakdown.physical}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No assessment taken yet by this client.</p>
                    )}
                  </div>

                  {/* Recent Mood Logs */}
                  <div>
                    <h4 style={{ fontSize: '0.95rem', color: '#0d9488', marginBottom: '0.75rem', fontWeight: 700 }}>
                      Recent Mood Logs
                    </h4>
                    {patientData.recentMood?.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {patientData.recentMood.map((m) => (
                          <div key={m._id} style={{ padding: '0.65rem 0.85rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                              <span style={{ textTransform: 'capitalize', color: '#0f172a' }}>Mood: {m.mood} ({m.intensity}/10)</span>
                              <span style={{ color: '#94a3b8' }}>{new Date(m.entryDate).toLocaleDateString()}</span>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569' }}>"{m.notes}"</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No mood entries recorded yet.</p>
                    )}
                  </div>
                </div>
              ) : null}

              <button
                onClick={() => setSelectedPatient(null)}
                className="btn btn-secondary"
                style={{ width: '100%', marginTop: '1.5rem' }}
              >
                Close Profile
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CounselorDashboard;
