import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ServiceCard from '../components/ServiceCard';
import './Profile.css';

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser]         = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/auth/me`).catch(() => null),
      api.get(`/services?provider=${id}&limit=20`),
    ])
      .then(([, sRes]) => {
        setServices(sRes.data.services);
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));

    // Fetch provider info via a service's populated provider field
    api.get(`/services?provider=${id}&limit=1`).then(res => {
      if (res.data.services.length > 0) setUser(res.data.services[0].provider);
    });
  }, [id, navigate]);

  if (loading) return <div className="spinner" />;

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

  return (
    <main className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
      <div className="profile-header card">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-info">
          <h1 className="profile-name">{user?.name || 'Provider'}</h1>
          {user?.location && <p className="profile-location">📍 {user.location}</p>}
          {user?.bio && <p className="profile-bio">{user.bio}</p>}
          {user?.skills?.length > 0 && (
            <div className="profile-skills">
              {user.skills.map(s => <span key={s} className="sd-tag">{s}</span>)}
            </div>
          )}
          {user?.averageRating > 0 && (
            <div className="stars" style={{ marginTop: 10 }}>
              {[1,2,3,4,5].map(s => (
                <div key={s} className={`star${s <= Math.round(user.averageRating) ? '' : ' star-empty'}`} />
              ))}
              <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 8 }}>
                {user.averageRating} · {user.totalReviews} review{user.totalReviews !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      <h2 className="profile-section-title">Services ({services.length})</h2>

      {services.length === 0 ? (
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>No services listed yet.</p>
      ) : (
        <div className="listings-grid">
          {services.map(s => <ServiceCard key={s._id} service={s} />)}
        </div>
      )}
    </main>
  );
}
