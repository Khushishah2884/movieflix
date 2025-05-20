import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    number: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    // Email validation
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    // Number validation
    if (!/^\d{10}$/.test(form.number)) {
      newErrors.number = 'Mobile number must be 10 digits';
    }
    // Password validation
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(form.password)
    ) {
      newErrors.password =
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character';
    }
    // Confirm password validation
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:2001/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          number: form.number,
          password: form.password,
        }),
      });
      console.log(JSON.stringify(res));
      const data = await res.json();
      if (!res.ok) {
        setErrors({ api: data.message });
      } else {
        // Optionally store user info or token here
        navigate('/'); // Redirect to home page after successful signup
      }
    } catch {
      setErrors({ api: 'Server error' });
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate('/')}
          aria-label="Back to Home"
        >
          ← Back
        </button>
        <h2>Sign Up</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        {errors.email && <div className="form-error">{errors.email}</div>}
        <input
          type="tel"
          name="number"
          placeholder="Mobile Number"
          value={form.number}
          onChange={handleChange}
          required
          maxLength={10}
        />
        {errors.number && <div className="form-error">{errors.number}</div>}
        <div className="password-field">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
          <span
            className="view-icon"
            onClick={() => setShowPassword(v => !v)}
            tabIndex={0}
            role="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>
        {errors.password && <div className="form-error">{errors.password}</div>}
        <div className="password-field">
          <input
            type={showConfPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
          <span
            className="view-icon"
            onClick={() => setShowConfPassword(v => !v)}
            tabIndex={0}
            role="button"
            aria-label={showConfPassword ? 'Hide password' : 'Show password'}
          >
            {showConfPassword ? '🙈' : '👁️'}
          </span>
        </div>
        {errors.confirmPassword && (
          <div className="form-error">{errors.confirmPassword}</div>
        )}
        {errors.api && <div className="form-error">{errors.api}</div>}
        <button type="submit" className="login-submit-btn" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        <div className="form-footer">
          <span>Already registered? </span>
          <Link to="/login" className="form-link">Login here</Link>
        </div>
      </form>
    </div>
  );
}

export default Signup;
