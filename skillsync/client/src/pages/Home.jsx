import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ServiceCard from '../components/ServiceCard';
import './Home.css';

const CATEGORIES = [
  { key: 'Design',    label: 'Design & Creative',    icon: '🎨' },
  { key: 'Writing',   label: 'Content & Writing',    icon: '✍️' },
  { key: 'Dev',       label: 'Web Development',       icon: '💻' },
  { key: 'Tutoring',  label: 'Tutoring & Teaching',   icon: '📚' },
  { key: 'Marketing', label: 'Marketing & SEO',       icon: '📣' },
  { key: 'Video',     label: 'Video & Animation',     icon: '🎬' },
  { key: 'Finance',   label: 'Finance & Accounting',  icon: '📊' },
  { key: 'Other',     label: 'Other Skills',          icon: '🔧' },
];

export default function Home() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get('/services?limit=6')
      .then(res => setFeatured(res.data.services))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      {/* Hero */}
      <section className="hero container">
        <div className="hero__left">
          <p className="hero__eyebrow">Micro-Services Marketplace</p>
          <h1 className="hero__title">
            Find the <em>right skill</em><br />for every project
          </h1>
          <p className="hero__sub">
            SkillSync connects you with vetted independent professionals — from web design
            to tutoring — all in one place.
          </p>
          <div className="hero__ctas">
            <button className="btn-primary" onClick={() => navigate('/browse')}>Browse services</button>
            <button className="btn-ghost" onClick={() => navigate('/register')}>Offer your skill</button>
          </div>
          <div className="hero__stats">
            <div><span className="stat-num">1,240</span><p>Active providers</p></div>
            <div><span className="stat-num">98%</span><p>Satisfaction rate</p></div>
            <div><span className="stat-num">3,800+</span><p>Projects done</p></div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section container">
        <p className="section-label">Service categories</p>
        <div className="cats-grid">
          {CATEGORIES.map(c => (
            <div key={c.key} className="cat-card"
              onClick={() => navigate(`/browse?category=${c.key}`)}>
              <span className="cat-icon">{c.icon}</span>
              <p className="cat-name">{c.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="section container">
        <p className="section-label">Featured services</p>
        {loading ? <div className="spinner" /> : (
          <div className="listings-grid">
            {featured.map(s => <ServiceCard key={s._id} service={s} />)}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button className="btn-ghost" onClick={() => navigate('/browse')}>View all services →</button>
        </div>
      </section>

      {/* How it works */}
      <section className="section container">
        <p className="section-label">How SkillSync works</p>
        <div className="steps-grid">
          {[
            { n:'01', t:'Create your profile', d:'Sign up as a client or provider and add your skills, portfolio, and pricing.' },
            { n:'02', t:'Browse or list',       d:'Clients discover services by category. Providers post gigs with clear deliverables.' },
            { n:'03', t:'Book & collaborate',   d:'Request a booking, coordinate via messaging, and release payment on delivery.' },
          ].map(s => (
            <div key={s.n} className="step-card">
              <div className="step-num">{s.n}</div>
              <h3 className="step-title">{s.t}</h3>
              <p className="step-desc">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="footer-cta">
        <h2>Ready to sync your skills?</h2>
        <p>Join 1,200+ professionals already growing on SkillSync.</p>
        <div className="hero__ctas" style={{ justifyContent: 'center' }}>
          <button className="btn-primary" onClick={() => navigate('/register')}>Start offering services</button>
          <button className="btn-ghost"   onClick={() => navigate('/browse')}>Find a professional</button>
        </div>
      </section>
    </main>
  );
}
