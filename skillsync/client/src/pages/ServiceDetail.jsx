import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import BookingModal from '../components/BookingModal';
import ReviewCard   from '../components/ReviewCard';
import './ServiceDetail.css';

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService]   = useState(null);
  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showBook, setShowBook] = useState(false);

  useEffect(() => {
    Promise.all([api.get(`/services/${id}`), api.get(`/reviews/${id}`)])
      .then(([sRes, rRes]) => { setService(sRes.data); setReviews(rRes.data); })
      .catch(() => navigate('/browse'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div className="spinner" />;
  if (!service) return null;

  const prov = service.provider;
  const initials = prov?.name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) || '??';

  return (
    <main className="container sd-layout">
      {/* Left */}
      <div className="sd-main">
        <p className="sd-cat">{service.category}</p>
        <h1 className="sd-title">{service.title}</h1>

        {service.averageRating > 0 && (
          <div className="stars" style={{ marginBottom: 12 }}>
            {[1,2,3,4,5].map(s => (
              <div key={s} className={`star${s <= Math.round(service.averageRating) ? '' : ' star-empty'}`} />
            ))}
            <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 8 }}>
              {service.averageRating} · {service.totalReviews} review{service.totalReviews !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        <div className="sd-delivery">
          🕐 Delivery in <strong>{service.deliveryDays} day{service.deliveryDays !== 1 ? 's' : ''}</strong>
        </div>

        <p className="sd-desc">{service.description}</p>

        {service.tags?.length > 0 && (
          <div className="sd-tags">
            {service.tags.map(t => <span key={t} className="sd-tag">{t}</span>)}
          </div>
        )}

        {/* Reviews */}
        <h2 className="sd-section-title">Reviews ({reviews.length})</h2>
        {reviews.length === 0
          ? <p style={{ color: 'var(--muted)', fontSize: 14 }}>No reviews yet.</p>
          : reviews.map(r => <ReviewCard key={r._id} review={r} />)
        }
      </div>

      {/* Right sidebar */}
      <aside className="sd-sidebar">
        <div className="sd-price-card card">
          <p className="sd-price">₹{service.price.toLocaleString()} <span>/ {service.priceUnit}</span></p>
          <button className="btn-primary" style={{ width:'100%', marginTop:16 }}
            onClick={() => setShowBook(true)}>
            Book this service
          </button>
        </div>

        {/* Provider */}
        <div className="sd-prov-card card" style={{ marginTop: 16 }}>
          <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:12 }}>
            <div className="mini-av" style={{ width:44, height:44, fontSize:15, background:'#EEEDFE', color:'#534AB7' }}>
              {initials}
            </div>
            <div>
              <p style={{ fontWeight:500 }}>{prov?.name}</p>
              <p style={{ fontSize:12, color:'var(--muted)' }}>{prov?.location}</p>
            </div>
          </div>
          {prov?.bio && <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.6, marginBottom:12 }}>{prov.bio}</p>}
          <button className="btn-ghost" style={{ width:'100%', fontSize:13 }}
            onClick={() => navigate(`/profile/${prov?._id}`)}>
            View full profile
          </button>
        </div>
      </aside>

      {showBook && <BookingModal service={service} onClose={() => setShowBook(false)} />}
    </main>
  );
}
