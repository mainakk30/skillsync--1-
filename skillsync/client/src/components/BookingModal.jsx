import React, { useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './BookingModal.css';

export default function BookingModal({ service, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ brief: '', budget: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!user) { onClose(); navigate('/login'); return; }
    if (!form.brief.trim()) { setError('Please describe your project.'); return; }
    setLoading(true); setError('');
    try {
      await api.post('/bookings', { serviceId: service._id, brief: form.brief, budget: Number(form.budget) });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✕</button>

        {success ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>Booking sent!</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>
              The provider will respond within 24 hours.
            </p>
            <button className="btn-primary" style={{ marginTop: 20 }} onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <h2 className="modal-title">Book this service</h2>
            <p className="modal-sub">{service.title}</p>

            <div className="form-group">
              <label>Project brief</label>
              <textarea name="brief" value={form.brief} onChange={handle}
                placeholder="Describe what you need, timeline, and any specific requirements..." />
            </div>

            <div className="form-group">
              <label>Your budget (₹) — optional</label>
              <input type="number" name="budget" value={form.budget} onChange={handle}
                placeholder={`Provider starts at ₹${service.price.toLocaleString()}`} />
            </div>

            {error && <p className="error-msg">{error}</p>}

            <button className="btn-primary" style={{ width: '100%' }} onClick={submit} disabled={loading}>
              {loading ? 'Sending...' : 'Confirm booking →'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
