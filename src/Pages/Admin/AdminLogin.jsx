import React, { useState } from 'react';
import axios from 'axios';
import './AdminLogin.css';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/api';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(`${API_BASE_URL}/admin/login`, form);
      if (res.data.success) {
        localStorage.setItem('adminToken', res.data.token);
        navigate('/admin/dashboard');
      } else {
        setError('Login failed');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError('Invalid email or password');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-hero">
        <span className="admin-login-badge">Seller Dashboard</span>
        <h1>Run Annie Shop with a cleaner control room.</h1>
        <p>
          A redesigned admin experience inspired by the seller-dashboard reference,
          with stronger hierarchy, darker editorial surfaces, and clearer action points.
        </p>
        <div className="admin-login-metrics">
          <div>
            <strong>Catalog</strong>
            <span>Manage inventory, popular picks, and pre-orders.</span>
          </div>
          <div>
            <strong>Orders</strong>
            <span>Track operations without losing sight of customer details.</span>
          </div>
        </div>
      </div>

      <form className="admin-login-form" onSubmit={handleSubmit}>
        <div className="admin-login-form-copy">
          <p className="admin-login-form-kicker">Welcome back</p>
          <h2>Admin Login</h2>
          <p>Use your admin credentials to enter the dashboard.</p>
        </div>

        <input
          type="email"
          name="email"
          placeholder="Admin Email"
          value={form.email}
          onChange={handleInput}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleInput}
          required
        />

        {error && <p className="error-text">{error}</p>}

        <button type="submit">Enter Dashboard</button>
      </form>
    </div>
  );
};

export default AdminLogin;
