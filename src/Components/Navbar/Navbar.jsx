import React, { useEffect, useMemo, useState } from 'react';
import './Navbar.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/api';

const pageTitles = {
  '/admin/dashboard': 'Dashboard Overview',
  '/admin/products': 'Catalog Control',
  '/admin/categories': 'Category Control',
  '/admin/orders': 'Order Operations',
  '/admin/customers': 'Customer Relations',
  '/admin/settings': 'Store Settings',
};

const Navbar = () => {
  const [profileImage, setProfileImage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/admin/settings`);
        if (res.data?.profileImage) {
          setProfileImage(res.data.profileImage);
        }
      } catch (err) {
        console.error('Failed to fetch profile image:', err);
      }
    };
    fetchSettings();
  }, []);

  const pageTitle = useMemo(
    () => pageTitles[location.pathname] || 'Admin Workspace',
    [location.pathname]
  );

  const today = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  return (
    <header className="navbar">
      <div className="navbar-copy">
        <p className="navbar-kicker">{today}</p>
        <h2>{pageTitle}</h2>
      </div>

      <div className="navbar-actions">
        <div className="navbar-chip">
          <span className="navbar-chip-indicator" />
          Store online
        </div>
        <button type="button" className="navbar-logout" onClick={handleLogout}>
          Logout
        </button>
        <div className="navbar-profile-shell">
          <img
            src={profileImage || 'https://via.placeholder.com/56?text=A'}
            alt="Admin"
            className="nav-profile"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
