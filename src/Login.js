import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({});
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:2001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ api: data.message });
      } else {
        // Save user and token for session
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        // Redirect to home page after login
        navigate('/');
      }
    } catch {
      setErrors({ api: 'Server error' });
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate('/')}
          aria-label="Back to Home"
        >
          ← Back
        </button>
        <h2>Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="login-submit-btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {errors.api && <div className="form-error">{errors.api}</div>}
        <div className="form-footer">
          <span>Don't have an account? </span>
          <Link to="/signup" className="form-link">Sign up</Link>
        </div>
        {/* <div className="form-footer">
          <Link to="/forgot-password" className="form-link">Forgot password?</Link>
        </div> */}
      </form>
    </div>
  );
}

export default Login;
