import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const STATUS_COLORS = {
  pending:   'badge-amber',
  accepted:  'badge-blue',
  completed: 'badge-green',
  declined:  'badge-coral',
  cancelled: 'badge-coral',
};

export default function Dashboard() {
  const { user } = useAuth();
  const [tab, setTab]           = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState({ title:'', description:'', category:'Design', price:'', priceUnit:'project', deliveryDays:3, tags:'' });
  const [formMsg, setFormMsg]   = useState({ type:'', text:'' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/bookings'),
      api.get('/services'),
    ]).then(([bRes, sRes]) => {
      setBookings(bRes.data);
      // filter to own services
      setServices(sRes.data.services.filter(s => s.provider?._id === user._id || s.provider === user._id));
    }).finally(() => setLoading(false));
  }, [user._id]);

  const updateBooking = async (id, status) => {
    await api.put(`/bookings/${id}`, { status });
    setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
  };

  const handleForm = e => setForm({ ...form, [e.target.name]: e.target.value });

  const createService = async e => {
    e.preventDefault();
    setSubmitting(true); setFormMsg({ type:'', text:'' });
    try {
      const payload = { ...form, price: Number(form.price), tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean) };
      const { data } = await api.post('/services', payload);
      setServices(prev => [data, ...prev]);
      setForm({ title:'', description:'', category:'Design', price:'', priceUnit:'project', deliveryDays:3, tags:'' });
      setFormMsg({ type:'success', text:'Service listed successfully!' });
    } catch (err) {
      setFormMsg({ type:'error', text: err.response?.data?.message || 'Failed to create service.' });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    await api.delete(`/services/${id}`);
    setServices(prev => prev.filter(s => s._id !== id));
  };

  if (loading) return <div className="spinner" />;

  return (
    <main className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
      <h1 className="dash-title">Dashboard</h1>
      <p className="dash-sub">Welcome back, {user.name} · <span className="badge badge-blue">{user.role}</span></p>

      <div className="dash-tabs">
        {['bookings', user.role === 'provider' ? 'services' : null, user.role === 'provider' ? 'new' : null]
          .filter(Boolean)
          .map(t => (
          <button key={t} className={`tab${tab === t ? ' tab--active' : ''}`} onClick={() => setTab(t)}>
            {t === 'bookings' ? 'My Bookings' : t === 'services' ? 'My Services' : 'List a Service'}
          </button>
        ))}
      </div>

      {/* Bookings */}
      {tab === 'bookings' && (
        bookings.length === 0 ? (
          <p style={{ color:'var(--muted)', fontSize:14 }}>No bookings yet.</p>
        ) : (
          <div className="booking-list">
            {bookings.map(b => (
              <div key={b._id} className="booking-card card">
                <div className="booking-card__top">
                  <div>
                    <p className="booking-service">{b.service?.title || 'Service'}</p>
                    <p className="booking-meta">
                      {user.role === 'provider' ? `Client: ${b.client?.name}` : `Provider: ${b.provider?.name}`}
                      {b.budget ? ` · ₹${b.budget.toLocaleString()}` : ''}
                    </p>
                  </div>
                  <span className={`badge ${STATUS_COLORS[b.status] || 'badge-amber'}`}>{b.status}</span>
                </div>
                <p className="booking-brief">{b.brief}</p>
                {user.role === 'provider' && b.status === 'pending' && (
                  <div className="booking-actions">
                    <button className="btn-primary" style={{ fontSize:12, padding:'6px 16px' }}
                      onClick={() => updateBooking(b._id, 'accepted')}>Accept</button>
                    <button className="btn-ghost" style={{ fontSize:12, padding:'6px 16px' }}
                      onClick={() => updateBooking(b._id, 'declined')}>Decline</button>
                  </div>
                )}
                {user.role === 'provider' && b.status === 'accepted' && (
                  <div className="booking-actions">
                    <button className="btn-primary" style={{ fontSize:12, padding:'6px 16px' }}
                      onClick={() => updateBooking(b._id, 'completed')}>Mark Completed</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {/* Services */}
      {tab === 'services' && (
        services.length === 0 ? (
          <p style={{ color:'var(--muted)', fontSize:14 }}>No services listed yet. Click "List a Service" to add one.</p>
        ) : (
          <div className="service-list">
            {services.map(s => (
              <div key={s._id} className="service-row card">
                <div>
                  <p style={{ fontWeight:500 }}>{s.title}</p>
                  <p style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>
                    {s.category} · ₹{s.price.toLocaleString()} / {s.priceUnit}
                    {s.averageRating > 0 ? ` · ⭐ ${s.averageRating}` : ''}
                  </p>
                </div>
                <button className="btn-ghost" style={{ fontSize:12, padding:'5px 14px', color:'#e24b4a', borderColor:'#e24b4a' }}
                  onClick={() => deleteService(s._id)}>Delete</button>
              </div>
            ))}
          </div>
        )
      )}

      {/* New service form */}
      {tab === 'new' && (
        <form className="new-service-form" onSubmit={createService}>
          <div className="form-group">
            <label>Service title</label>
            <input name="title" value={form.title} onChange={handleForm} placeholder="e.g. Professional logo design" required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleForm}
              placeholder="Describe what clients get, your process, and deliverables..." required />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleForm}>
                {['Design','Writing','Dev','Tutoring','Marketing','Video','Finance','Other'].map(c =>
                  <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Price unit</label>
              <select name="priceUnit" value={form.priceUnit} onChange={handleForm}>
                {['project','hour','word','page'].map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Starting price (₹)</label>
              <input type="number" name="price" value={form.price} onChange={handleForm} placeholder="e.g. 3500" required min="0" />
            </div>
            <div className="form-group">
              <label>Delivery days</label>
              <input type="number" name="deliveryDays" value={form.deliveryDays} onChange={handleForm} min="1" />
            </div>
          </div>
          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input name="tags" value={form.tags} onChange={handleForm} placeholder="e.g. logo, branding, illustrator" />
          </div>
          {formMsg.text && <p className={formMsg.type === 'success' ? 'success-msg' : 'error-msg'}>{formMsg.text}</p>}
          <button className="btn-primary" type="submit" disabled={submitting} style={{ marginTop:8 }}>
            {submitting ? 'Publishing...' : 'Publish service →'}
          </button>
        </form>
      )}
    </main>
  );
}
