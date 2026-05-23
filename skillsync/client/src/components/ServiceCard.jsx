import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ServiceCard.css';

const CAT_COLORS = {
  Design:    { bg: '#EEEDFE', icon: '🎨' },
  Writing:   { bg: '#E1F5EE', icon: '✍️' },
  Dev:       { bg: '#FAECE7', icon: '💻' },
  Tutoring:  { bg: '#FAEEDA', icon: '📚' },
  Marketing: { bg: '#E6F1FB', icon: '📣' },
  Video:     { bg: '#FBEAF0', icon: '🎬' },
  Finance:   { bg: '#EAF3DE', icon: '📊' },
  Other:     { bg: '#F1EFE8', icon: '🔧' },
};

export default function ServiceCard({ service }) {
  const navigate = useNavigate();
  const meta = CAT_COLORS[service.category] || CAT_COLORS.Other;
  const initials = service.provider?.name
    ? service.provider.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
    : '??';

  return (
    <div className="service-card" onClick={() => navigate(`/services/${service._id}`)}>
      <div className="service-card__thumb" style={{ background: meta.bg }}>
        <span>{meta.icon}</span>
      </div>
      <div className="service-card__body">
        <p className="service-card__cat">{service.category}</p>
        <h3 className="service-card__title">{service.title}</h3>

        {service.averageRating > 0 && (
          <div className="stars" style={{ marginBottom: 8 }}>
            {[1,2,3,4,5].map(s => (
              <div key={s} className={`star${s <= Math.round(service.averageRating) ? '' : ' star-empty'}`} />
            ))}
            <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 6 }}>
              {service.averageRating} ({service.totalReviews})
            </span>
          </div>
        )}

        <div className="service-card__footer">
          <span className="service-card__price">
            ₹{service.price.toLocaleString()}
            <span className="service-card__unit"> / {service.priceUnit}</span>
          </span>
          <div className="service-card__prov">
            <div className="mini-av">{initials}</div>
            <span>{service.provider?.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
