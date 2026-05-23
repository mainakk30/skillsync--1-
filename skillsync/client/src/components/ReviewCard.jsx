import React from 'react';

export default function ReviewCard({ review }) {
  const initials = review.reviewer?.name
    ? review.reviewer.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
    : '??';

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div className="mini-av" style={{ width: 34, height: 34, fontSize: 12 }}>{initials}</div>
        <div>
          <p style={{ fontWeight: 500, fontSize: 14 }}>{review.reviewer?.name}</p>
          <p style={{ fontSize: 11, color: 'var(--muted)' }}>
            {new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
        </div>
        <div className="stars" style={{ marginLeft: 'auto' }}>
          {[1,2,3,4,5].map(s => (
            <div key={s} className={`star${s <= review.rating ? '' : ' star-empty'}`} />
          ))}
        </div>
      </div>
      <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.6 }}>{review.comment}</p>
    </div>
  );
}
