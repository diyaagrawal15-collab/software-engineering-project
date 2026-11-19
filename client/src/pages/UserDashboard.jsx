import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  assessmentService,
  moodService,
  recommendationService,
  appointmentService,
} from '../services/api';
import {
  Activity,
  BookOpen,
  Sparkles,
  Calendar,
  BarChart2,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Smile,
  Meh,
  Frown,
  Wind,
  ShieldCheck,
  Video,
} from 'lucide-react';

const MOOD_OPTIONS = [
  { key: 'great', label: 'Great', emoji: '😄', color: '#10b981' },
  { key: 'good', label: 'Good', emoji: '🙂', color: '#0ea5e9' },
  { key: 'neutral', label: 'Neutral', emoji: '😐', color: '#64748b' },
  { key: 'anxious', label: 'Anxious', emoji: '😰', color: '#f59e0b' },
  { key: 'stressed', label: 'Stressed', emoji: '😫', color: '#ef4444' },
  { key: 'sad', label: 'Down', emoji: '😔', color: '#8b5cf6' },
];

const UserDashboard = () => {
  const { user } = useAuth();

  const [latestAssessment, setLatestAssessment] = useState(null);
  const [recentMoods, setRecentMoods] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick mood logger state
  const [selectedMood, setSelectedMood] = useState('good');
  const [quickNote, setQuickNote] = useState('');
  const [moodSaving, setMoodSaving] = useState(false);
  const [moodSuccess, setMoodSuccess] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [assessRes, moodRes, recRes, apptRes] = await Promise.allSettled([
        assessmentService.getLatest(),
        moodService.getEntries(),
        recommendationService.getPersonalized(),
        appointmentService.getMyAppointments(),
      ]);

      if (assessRes.status === 'fulfilled' && assessRes.value.data.success) {
        setLatestAssessment(assessRes.value.data.data);
      }
      if (moodRes.status === 'fulfilled' && moodRes.value.data.success) {
        setRecentMoods(moodRes.value.data.data.slice(0, 4));
      }
      if (recRes.status === 'fulfilled' && recRes.value.data.success) {
        setRecommendations(recRes.value.data.data.slice(0, 3));
      }
      if (apptRes.status === 'fulfilled' && apptRes.value.data.success) {
        const upcoming = apptRes.value.data.data.filter(
          (a) => a.status === 'pending' || a.status === 'accepted'
        );
        setUpcomingAppointments(upcoming.slice(0, 2));
      }
    } catch (err) {
      console.error('[Dashboard] Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleQuickMoodSubmit = async (e) => {
    e.preventDefault();
    if (!quickNote.trim()) return;
    setMoodSaving(true);
    try {
      await moodService.createEntry({
        mood: selectedMood,
        intensity: selectedMood === 'great' ? 8 : selectedMood === 'stressed' ? 7 : 5,
        title: `Quick ${selectedMood.toUpperCase()} Check-in`,
        notes: quickNote,
        tags: ['QuickCheckin'],
      });
      setQuickNote('');
      setMoodSuccess(true);
      setTimeout(() => setMoodSuccess(false), 3000);
      // Refresh mood list
      const moodRes = await moodService.getEntries();
      if (moodRes.data.success) {
        setRecentMoods(moodRes.data.data.slice(0, 4));
      }
    } catch (err) {
      console.error('Failed to log mood:', err);
    } finally {
      setMoodSaving(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0', minHeight: '80vh' }}>
      <div className="container">
        
        {/* Welcome Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', color: '#0f172a', marginBottom: '0.25rem' }}>
              Welcome back, {user?.name || 'Friend'} 👋
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Here is your mental wellness and stress tracking overview for today.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/assessment" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
              <Activity size={17} />
              Take Stress Assessment
            </Link>
            <Link to="/recommendations" className="btn btn-secondary" style={{ padding: '0.65rem 1.25rem' }}>
              <Wind size={17} />
              Breathe & Relax
            </Link>
          </div>
        </div>

        {/* Top Overview Cards */}
        <div className="grid-3" style={{ marginBottom: '2rem' }}>
          
          {/* Latest Assessment Status */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Latest Stress Level
                </span>
                {latestAssessment ? (
                  <span className={`badge badge-${latestAssessment.stressLevel.toLowerCase()}`}>
                    {latestAssessment.stressLevel} Stress
                  </span>
                ) : (
                  <span className="badge badge-pending">Not Assessed</span>
                )}
              </div>

              {latestAssessment ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>
                      {latestAssessment.totalScore}
                    </span>
                    <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 600 }}>/ 40 pts</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem', lineHeight: 1.5 }}>
                    {latestAssessment.summaryText.substring(0, 110)}...
                  </p>
                </>
              ) : (
                <div style={{ padding: '1rem 0' }}>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.75rem' }}>
                    You haven't evaluated your stress yet. Complete our 3-minute PSS-10 test to calibrate your baseline.
                  </p>
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.85rem' }}>
              <Link
                to={latestAssessment ? `/assessment/result/${latestAssessment._id}` : '/assessment'}
                style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                {latestAssessment ? 'View Full Analysis & Breakdown' : 'Start First Assessment'}
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Quick Mood Logger Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Daily Mood Log
              </span>
              <Link to="/mood" style={{ fontSize: '0.78rem', fontWeight: 600 }}>View All</Link>
            </div>

            <form onSubmit={handleQuickMoodSubmit}>
              {/* Mood Emojis */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                {MOOD_OPTIONS.map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setSelectedMood(m.key)}
                    style={{
                      background: selectedMood === m.key ? '#e0f2fe' : 'transparent',
                      border: selectedMood === m.key ? '2px solid #0284c7' : '1px solid var(--border)',
                      borderRadius: '10px',
                      padding: '0.4rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.2rem',
                      width: '44px',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>{m.emoji}</span>
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="What influenced your mood today?"
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {moodSuccess && (
                  <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <CheckCircle2 size={13} /> Saved!
                  </span>
                )}
                <button
                  type="submit"
                  disabled={moodSaving || !quickNote.trim()}
                  className="btn btn-secondary"
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', marginLeft: 'auto' }}
                >
                  {moodSaving ? 'Saving...' : 'Log Mood'}
                </button>
              </div>
            </form>
          </div>

          {/* Upcoming Counseling Session */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Counseling Sessions
                </span>
                <Link to="/appointments" style={{ fontSize: '0.78rem', fontWeight: 600 }}>Book Session</Link>
              </div>

              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appt) => (
                  <div
                    key={appt._id}
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      padding: '0.75rem',
                      marginBottom: '0.5rem',
                      backgroundColor: '#f8fafc'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                        {appt.counselor?.name}
                      </span>
                      <span className={`badge badge-${appt.status}`}>
                        {appt.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={13} />
                      {new Date(appt.appointmentDate).toLocaleDateString()} at {appt.timeSlot}
                    </div>
                    {appt.status === 'accepted' && (
                      <a
                        href={appt.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', marginTop: '0.5rem' }}
                      >
                        <Video size={13} /> Join Consultation Room
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ padding: '1rem 0' }}>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
                    No upcoming appointments. Our certified clinical counselors are available for confidential sessions.
                  </p>
                  <Link to="/appointments" className="btn btn-outline" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
                    Schedule Consultation
                  </Link>
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.85rem' }}>
              <Link to="/appointments" style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                View All Appointments <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>

        {/* Personalized Recommendations Section */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', color: '#0f172a' }}>Personalized Self-Care Protocols</h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Tailored based on your latest evaluation ({latestAssessment?.stressLevel || 'Baseline'} Stress Level)
              </p>
            </div>
            <Link to="/recommendations" style={{ fontSize: '0.875rem', fontWeight: 700 }}>Browse All Guides →</Link>
          </div>

          <div className="grid-3">
            {recommendations.map((rec) => (
              <div key={rec._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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
                      {rec.category.replace('_', ' ')}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={13} /> {rec.durationMinutes} mins
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem', color: '#0f172a' }}>{rec.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {rec.description}
                  </p>
                </div>
                <Link
                  to="/recommendations"
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem' }}
                >
                  Start Practice
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Mood Journal Entries Feed */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', color: '#0f172a' }}>Recent Reflection Logs</h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Your personal daily thought and stress diary</p>
            </div>
            <Link to="/mood" style={{ fontSize: '0.875rem', fontWeight: 700 }}>Open Mood Journal →</Link>
          </div>

          {recentMoods.length > 0 ? (
            <div className="grid-2">
              {recentMoods.map((entry) => (
                <div key={entry._id} className="card" style={{ borderLeft: '4px solid #0284c7' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', textTransform: 'capitalize', color: '#0f172a' }}>
                      {entry.title || `${entry.mood} Reflection`}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {new Date(entry.entryDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                    "{entry.notes}"
                  </p>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#334155' }}>
                      Mood: {entry.mood} ({entry.intensity}/10)
                    </span>
                    {entry.tags?.map((t, i) => (
                      <span key={i} className="badge" style={{ backgroundColor: '#e2e8f0', color: '#475569' }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <BookOpen size={32} style={{ color: '#94a3b8', margin: '0 auto 0.75rem auto' }} />
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>
                You have not saved any mood journal reflections yet. Writing your thoughts releases tension.
              </p>
              <Link to="/mood" className="btn btn-primary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.875rem' }}>
                Write Your First Journal Entry
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;
