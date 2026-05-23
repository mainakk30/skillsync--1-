import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ServiceCard from '../components/ServiceCard';
import './Browse.css';

const CATS = ['All','Design','Writing','Dev','Tutoring','Marketing','Video','Finance','Other'];

export default function Browse() {
  const [params, setParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [loading, setLoading]   = useState(true);

  const category = params.get('category') || 'All';
  const search   = params.get('search')   || '';

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page, limit: 12 });
      if (category && category !== 'All') q.set('category', category);
      if (search) q.set('search', search);
      const { data } = await api.get(`/services?${q}`);
      setServices(data.services);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [category, search, page]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const setCategory = (cat) => {
    setPage(1);
    const p = new URLSearchParams(params);
    if (cat === 'All') p.delete('category'); else p.set('category', cat);
    setParams(p);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const val = e.target.q.value.trim();
    const p = new URLSearchParams(params);
    if (val) p.set('search', val); else p.delete('search');
    setPage(1); setParams(p);
  };

  return (
    <main className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <h1 className="browse-title">Browse services</h1>

      {/* Search */}
      <form className="browse-search" onSubmit={handleSearch}>
        <input name="q" defaultValue={search} placeholder="Search by title, skill, or keyword..." />
        <button className="btn-primary" type="submit">Search</button>
      </form>

      {/* Category tabs */}
      <div className="browse-tabs">
        {CATS.map(c => (
          <button key={c} className={`tab${category === c || (c === 'All' && !category) ? ' tab--active' : ''}`}
            onClick={() => setCategory(c)}>
            {c === 'All' ? 'All services' : c}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="browse-count">{total} service{total !== 1 ? 's' : ''} found</p>

      {/* Grid */}
      {loading ? <div className="spinner" /> : services.length === 0 ? (
        <div className="browse-empty">No services found. Try a different search or category.</div>
      ) : (
        <div className="listings-grid">
          {services.map(s => <ServiceCard key={s._id} service={s} />)}
        </div>
      )}

      {/* Pagination */}
      {total > 12 && (
        <div className="browse-pager">
          <button className="btn-ghost" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span>Page {page} of {Math.ceil(total / 12)}</span>
          <button className="btn-ghost" disabled={page >= Math.ceil(total / 12)} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </main>
  );
}
