import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form, setForm]     = useState({ name:'', email:'', password:'', role:'client' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError('');
    try {
      const user = await register(form.name, form.email, form.password, form.role);
      navigate(user.role === 'provider' ? '/dashboard' : '/browse');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card card">
        <div className="auth-logo">
          <span style={{ width:8, height:8, borderRadius:'50%', background:'var(--warm)', display:'inline-block', marginRight:6 }} />
          SkillSync
        </div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Join the SkillSync community</p>

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Full name</label>
            <input name="name" value={form.name} onChange={handle} placeholder="Priya Sharma" required autoFocus />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@email.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handle} placeholder="Min. 6 characters" required />
          </div>
          <div className="form-group">
            <label>I want to</label>
            <div className="role-toggle">
              {[['client','Hire talent'],['provider','Offer services']].map(([val, label]) => (
                <button key={val} type="button"
                  className={`role-btn${form.role === val ? ' active' : ''}`}
                  onClick={() => setForm({ ...form, role: val })}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button className="btn-primary" type="submit" style={{ width:'100%', marginTop:8 }} disabled={loading}>
            {loading ? 'Creating account...' : 'Get started →'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
