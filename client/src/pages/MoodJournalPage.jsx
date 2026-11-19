import React, { useState, useEffect } from 'react';
import { moodService } from '../services/api';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Sparkles,
  TrendingUp,
  Smile,
  AlertCircle,
  CheckCircle2,
  Moon,
  Zap,
} from 'lucide-react';

const MOODS = [
  { key: 'great', label: 'Great', emoji: '😄', color: '#10b981' },
  { key: 'good', label: 'Good', emoji: '🙂', color: '#0ea5e9' },
  { key: 'neutral', label: 'Neutral', emoji: '😐', color: '#64748b' },
  { key: 'anxious', label: 'Anxious', emoji: '😰', color: '#f59e0b' },
  { key: 'stressed', label: 'Stressed', emoji: '😫', color: '#ef4444' },
  { key: 'sad', label: 'Sad', emoji: '😔', color: '#8b5cf6' },
  { key: 'angry', label: 'Frustrated', emoji: '😤', color: '#e11d48' },
];

const COMMON_TAGS = ['Work', 'Studies', 'Sleep', 'Exercise', 'Family', 'Relationships', 'Finance', 'Health'];

const MoodJournalPage = () => {
  const [entries, setEntries] = useState([]);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form State
  const [selectedMood, setSelectedMood] = useState('good');
  const [intensity, setIntensity] = useState(5);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedTags, setSelectedTags] = useState(['Work']);
  const [sleepHours, setSleepHours] = useState(7);
  const [energyLevel, setEnergyLevel] = useState(5);

  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [entriesRes, trendsRes] = await Promise.all([
        moodService.getEntries(),
        moodService.getTrends(),
      ]);
      if (entriesRes.data.success) {
        setEntries(entriesRes.data.data);
      }
      if (trendsRes.data.success) {
        setTrends(trendsRes.data.data);
      }
    } catch (err) {
      setError('Failed to load mood journal data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!notes.trim()) {
      setError('Please add your reflection notes.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const payload = {
        mood: selectedMood,
        intensity: Number(intensity),
        title: title.trim() || `${selectedMood.toUpperCase()} Reflection`,
        notes: notes.trim(),
        tags: selectedTags,
        sleepHours: Number(sleepHours),
        energyLevel: Number(energyLevel),
      };

      if (editingId) {
        await moodService.updateEntry(editingId, payload);
        setEditingId(null);
      } else {
        await moodService.createEntry(payload);
      }

      // Reset form
      setTitle('');
      setNotes('');
      setIntensity(5);
      setSleepHours(7);
      setEnergyLevel(5);
      setSelectedTags(['Work']);

      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving mood entry');
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (entry) => {
    setEditingId(entry._id);
    setSelectedMood(entry.mood);
    setIntensity(entry.intensity);
    setTitle(entry.title || '');
    setNotes(entry.notes);
    setSelectedTags(entry.tags || []);
    setSleepHours(entry.sleepHours || 7);
    setEnergyLevel(entry.energyLevel || 5);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm('Are you sure you want to delete this journal entry?')) return;
    try {
      await moodService.deleteEntry(id);
      await fetchData();
    } catch (err) {
      alert('Failed to delete entry');
    }
  };

  return (
    <div style={{ padding: '3rem 0', minHeight: '80vh' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#ccfbf1', color: '#0d9488', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            <BookOpen size={15} />
            <span>Reflective Emotional Journaling</span>
          </div>
          <h1 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '0.35rem' }}>
            Daily Mood Journal & Trends
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Express your daily state of mind, identify stressors, and recognize behavioral patterns.
          </p>
        </div>

        {/* Mood Trends Summary Row */}
        {trends && trends.totalEntries > 0 && (
          <div className="card" style={{ marginBottom: '2.5rem', background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} style={{ color: '#0284c7' }} />
              Emotional Patterns & Analytics ({trends.totalEntries} Logs Recorded)
            </h3>

            <div className="grid-3" style={{ marginBottom: '1.25rem' }}>
              <div style={{ background: '#ffffff', borderRadius: '10px', padding: '1rem', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Average Mood Intensity</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0284c7' }}>
                  {trends.averageIntensity} <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>/ 10</span>
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '10px', padding: '1rem', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Average Sleep Duration</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0d9488' }}>
                  {trends.averageSleep} <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>hours/night</span>
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '10px', padding: '1rem', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Most Frequent State</span>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#334155', textTransform: 'capitalize' }}>
                  {Object.entries(trends.moodDistribution).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Neutral'}
                </div>
              </div>
            </div>

            {/* Mood Distribution Bar */}
            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                Mood Frequency Breakdown
              </span>
              <div style={{ display: 'flex', height: '14px', borderRadius: '9999px', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
                {Object.entries(trends.moodDistribution).map(([mKey, count]) => {
                  if (count === 0) return null;
                  const pct = Math.round((count / trends.totalEntries) * 100);
                  const moodObj = MOODS.find((m) => m.key === mKey) || { color: '#64748b' };
                  return (
                    <div
                      key={mKey}
                      title={`${mKey}: ${count} (${pct}%)`}
                      style={{ width: `${pct}%`, backgroundColor: moodObj.color }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="grid-2" style={{ alignItems: 'flex-start' }}>
          
          {/* Left Column: Form */}
          <div className="card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: '#0f172a' }}>
              {editingId ? 'Edit Mood Reflection' : 'Record Today’s Mood'}
            </h2>

            {error && (
              <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              
              {/* Mood Select */}
              <div className="form-group">
                <label className="form-label">How are you feeling right now?</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {MOODS.map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setSelectedMood(m.key)}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '10px',
                        border: selectedMood === m.key ? `2px solid ${m.color}` : '1px solid var(--border)',
                        backgroundColor: selectedMood === m.key ? '#f8fafc' : '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.2rem',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ fontSize: '1.5rem' }}>{m.emoji}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: m.color }}>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Intensity Slider */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>Emotional Intensity</label>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0284c7' }}>{intensity} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={intensity}
                  onChange={(e) => setIntensity(e.target.value)}
                  style={{ width: '100%', accentColor: '#0284c7' }}
                />
              </div>

              {/* Title */}
              <div className="form-group">
                <label className="form-label">Title / Focus Topic</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Challenging morning meeting, or Peaceful evening walk"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Notes */}
              <div className="form-group">
                <label className="form-label">Personal Reflection & Thoughts *</label>
                <textarea
                  required
                  rows={4}
                  className="form-textarea"
                  placeholder="Write freely. What triggered these feelings? What thoughts were looping? What helped you feel a little calmer?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Sleep & Energy */}
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Moon size={14} /> Sleep Duration (hrs)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    className="form-input"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Zap size={14} /> Energy Level (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="form-input"
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(e.target.value)}
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="form-group">
                <label className="form-label">Related Triggers / Tags</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {COMMON_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        style={{
                          padding: '0.25rem 0.65rem',
                          borderRadius: '9999px',
                          border: isSelected ? '1px solid #0284c7' : '1px solid var(--border)',
                          backgroundColor: isSelected ? '#e0f2fe' : '#ffffff',
                          color: isSelected ? '#0369a1' : '#64748b',
                          fontSize: '0.78rem',
                          fontWeight: isSelected ? 700 : 500,
                          cursor: 'pointer'
                        }}
                      >
                        #{tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '0.75rem' }}
                >
                  {saving ? 'Saving Entry...' : editingId ? 'Update Entry' : 'Save Journal Entry'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setTitle('');
                      setNotes('');
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right Column: Feed of Past Entries */}
          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: '#0f172a' }}>
              Your Reflection Timeline ({entries.length})
            </h2>

            {entries.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {entries.map((entry) => {
                  const moodInfo = MOODS.find((m) => m.key === entry.mood) || { emoji: '🙂', color: '#0284c7' };
                  return (
                    <div
                      key={entry._id}
                      className="card"
                      style={{
                        borderLeft: `4px solid ${moodInfo.color}`,
                        padding: '1.25rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '1.35rem' }}>{moodInfo.emoji}</span>
                          <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                              {entry.title || `${entry.mood} Reflection`}
                            </h4>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                              {new Date(entry.entryDate).toLocaleDateString()} at {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button
                            onClick={() => handleEditClick(entry)}
                            style={{ background: 'transparent', padding: '0.3rem', color: '#64748b' }}
                            title="Edit"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(entry._id)}
                            style={{ background: 'transparent', padding: '0.3rem', color: '#ef4444' }}
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.6, marginBottom: '0.75rem', whiteSpace: 'pre-line' }}>
                        {entry.notes}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#334155' }}>
                            Intensity: {entry.intensity}/10
                          </span>
                          <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#334155' }}>
                            Sleep: {entry.sleepHours}h
                          </span>
                          {entry.tags?.map((t, i) => (
                            <span key={i} className="badge" style={{ backgroundColor: '#e2e8f0', color: '#475569' }}>
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
                <BookOpen size={36} style={{ color: '#94a3b8', margin: '0 auto 0.75rem auto' }} />
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>No Journal Entries Yet</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Use the form on the left to start recording your reflections.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default MoodJournalPage;
