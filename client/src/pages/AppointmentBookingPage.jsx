import React, { useState, useEffect } from 'react';
import { appointmentService } from '../services/api';
import {
  Calendar,
  Clock,
  User,
  Star,
  Award,
  CheckCircle2,
  AlertCircle,
  Video,
  X,
  Phone,
  ShieldCheck,
  CalendarCheck,
} from 'lucide-react';

const TIME_SLOTS = [
  '09:00 AM - 10:00 AM',
  '10:30 AM - 11:30 AM',
  '02:00 PM - 03:00 PM',
  '04:00 PM - 05:00 PM',
  '06:00 PM - 07:00 PM',
];

const AppointmentBookingPage = () => {
  const [counselors, setCounselors] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' or 'my-appointments'

  // Booking Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[0]);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modalSuccess, setModalSuccess] = useState('');
  const [modalError, setModalError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [counselorRes, apptRes] = await Promise.all([
        appointmentService.getCounselors(),
        appointmentService.getMyAppointments(),
      ]);
      if (counselorRes.data.success) {
        setCounselors(counselorRes.data.data);
      }
      if (apptRes.data.success) {
        setMyAppointments(apptRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load appointments data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openBookingModal = (counselor) => {
    setSelectedCounselor(counselor);
    // default to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split('T')[0]);
    setSelectedSlot(TIME_SLOTS[0]);
    setReason('');
    setModalError('');
    setModalSuccess('');
    setIsModalOpen(true);
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCounselor || !bookingDate || !reason.trim()) {
      setModalError('Please fill in all booking fields.');
      return;
    }

    setSubmitting(true);
    setModalError('');

    try {
      const res = await appointmentService.bookAppointment({
        counselorId: selectedCounselor._id,
        appointmentDate: bookingDate,
        timeSlot: selectedSlot,
        reason: reason.trim(),
      });

      if (res.data.success) {
        setModalSuccess('Appointment request submitted successfully! Awaiting counselor confirmation.');
        await fetchData();
        setTimeout(() => {
          setIsModalOpen(false);
          setActiveTab('my-appointments');
        }, 1800);
      }
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to book appointment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelAppointment = async (id) => {
    const cancelReason = window.prompt('Please enter the reason for cancellation:');
    if (cancelReason === null) return;

    try {
      await appointmentService.cancelAppointment(id, cancelReason);
      await fetchData();
    } catch (err) {
      alert('Failed to cancel appointment');
    }
  };

  return (
    <div style={{ padding: '3rem 0', minHeight: '80vh' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#fef3c7', color: '#d97706', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              <Calendar size={15} />
              <span>Certified Mental Health Support</span>
            </div>
            <h1 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '0.35rem' }}>
              Counseling & Guidance Consultations
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Connect 1-on-1 with accredited psychologists and stress management specialists.
            </p>
          </div>

          {/* Tab Selector */}
          <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '10px', padding: '4px' }}>
            <button
              onClick={() => setActiveTab('browse')}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                backgroundColor: activeTab === 'browse' ? '#ffffff' : 'transparent',
                color: activeTab === 'browse' ? '#0284c7' : '#64748b',
                boxShadow: activeTab === 'browse' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              Available Counselors ({counselors.length})
            </button>
            <button
              onClick={() => setActiveTab('my-appointments')}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                backgroundColor: activeTab === 'my-appointments' ? '#ffffff' : 'transparent',
                color: activeTab === 'my-appointments' ? '#0284c7' : '#64748b',
                boxShadow: activeTab === 'my-appointments' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              My Appointments ({myAppointments.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Available Counselors Directory */}
        {activeTab === 'browse' && (
          <div className="grid-2">
            {counselors.map((c) => (
              <div key={c._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                      <div style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '12px',
                        backgroundColor: '#e0f2fe',
                        color: '#0284c7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                        fontWeight: 700
                      }}>
                        {c.name.split(' ')[0][0]}{c.name.split(' ')[1]?.[0] || ''}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <h3 style={{ fontSize: '1.15rem', color: '#0f172a', margin: 0 }}>
                            {c.name}
                          </h3>
                          {c.isVerified && (
                            <ShieldCheck size={16} style={{ color: '#0284c7' }} title="Verified Clinical Counselor" />
                          )}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: '#0d9488', fontWeight: 600 }}>
                          {c.specialization}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#fef3c7', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#b45309' }}>
                      <Star size={13} fill="#f59e0b" color="#f59e0b" />
                      {c.rating || 4.9}
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {c.bio || 'Experienced mental wellness specialist providing supportive clinical counseling.'}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Award size={14} style={{ color: '#0284c7' }} />
                      <span>{c.qualifications}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={14} style={{ color: '#0284c7' }} />
                      <span>{c.experience} Years Clinical Experience</span>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CheckCircle2 size={14} /> Available This Week
                  </span>
                  <button
                    onClick={() => openBookingModal(c)}
                    className="btn btn-primary"
                    style={{ padding: '0.55rem 1.25rem', fontSize: '0.875rem' }}
                  >
                    <CalendarCheck size={16} />
                    Schedule Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: My Appointments List */}
        {activeTab === 'my-appointments' && (
          <div>
            {myAppointments.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {myAppointments.map((appt) => (
                  <div key={appt._id} className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <h3 style={{ fontSize: '1.15rem', color: '#0f172a', margin: 0 }}>
                            Session with {appt.counselor?.name}
                          </h3>
                          <span className={`badge badge-${appt.status}`}>
                            {appt.status}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.825rem', color: '#0d9488', fontWeight: 600 }}>
                          {appt.counselor?.specialization}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {appt.status === 'accepted' && (
                          <a
                            href={appt.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-primary"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                          >
                            <Video size={16} />
                            Join Video Consultation
                          </a>
                        )}

                        {['pending', 'accepted'].includes(appt.status) && (
                          <button
                            onClick={() => handleCancelAppointment(appt._id)}
                            className="btn btn-secondary"
                            style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem', color: '#ef4444' }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                      <div>
                        <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Date & Time</span>
                        <strong style={{ color: '#0f172a' }}>
                          {new Date(appt.appointmentDate).toLocaleDateString()} ({appt.timeSlot})
                        </strong>
                      </div>
                      <div>
                        <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Stress Level at Booking</span>
                        <strong style={{ color: '#0f172a' }}>{appt.stressLevelAtBooking || 'Not Assessed'}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Session ID</span>
                        <code style={{ fontSize: '0.75rem', color: '#64748b' }}>{appt._id.substring(0, 10)}...</code>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '0.5rem' }}>
                      <strong>Reason for Consultation:</strong> {appt.reason}
                    </div>

                    {appt.counselorAdvice && (
                      <div style={{ backgroundColor: '#f0fdfa', border: '1px solid #ccfbf1', borderRadius: '8px', padding: '0.85rem', marginTop: '0.75rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f766e', display: 'block', marginBottom: '0.25rem' }}>
                          Counselor Follow-up Guidance:
                        </span>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#134e4a', lineHeight: 1.5 }}>
                          "{appt.counselorAdvice}"
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <Calendar size={36} style={{ color: '#94a3b8', margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.35rem' }}>No Active Appointments</h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                  Browse our certified counselors and book your first 1-on-1 guidance consultation.
                </p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="btn btn-primary"
                >
                  Browse Counselors
                </button>
              </div>
            )}
          </div>
        )}

        {/* Booking Modal */}
        {isModalOpen && selectedCounselor && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>
                    Schedule Counseling Session
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: '#0d9488', fontWeight: 600 }}>
                    With {selectedCounselor.name}
                  </span>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: 'transparent', color: '#64748b', padding: '0.25rem' }}
                >
                  <X size={20} />
                </button>
              </div>

              {modalError && (
                <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  {modalError}
                </div>
              )}

              {modalSuccess && (
                <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  {modalSuccess}
                </div>
              )}

              <form onSubmit={handleBookSubmit}>
                
                <div className="form-group">
                  <label className="form-label">Select Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="form-input"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Select Available Time Slot</label>
                  <select
                    className="form-select"
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Primary Concern or Reason for Consultation *</label>
                  <textarea
                    required
                    rows={3}
                    className="form-textarea"
                    placeholder="Briefly describe what you'd like guidance with (e.g., severe exam anxiety, chronic workplace burnout, difficulty sleeping)..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>

                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0 0 1.25rem 0' }}>
                  All consultations are completely confidential. Your counselor will receive this request and confirm the schedule.
                </p>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '0.75rem' }}
                  >
                    {submitting ? 'Confirming...' : 'Submit Booking Request'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-secondary"
                  >
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

export default AppointmentBookingPage;
