import React, { useState, useEffect } from 'react';
import './Navbar.css';
import axios from 'axios';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('https://annieshop-backend.onrender.com/settings');
        if (res.data?.profileImage) {
          setProfileImage(res.data.profileImage);
        }
      } catch (err) {
        console.error("Failed to fetch profile image:", err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="navbar">
      <div className="nav-left">
        <img src="" alt="Annie Shop Admin" className="nav-logo" />
        <h2>Annie Admin</h2>
      </div>

      <div className="nav-right">
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li>Dashboard</li>
          <li>Products</li>
          <li>Orders</li>
          <li>Customers</li>
        </ul>
        <img
          src={profileImage || 'https://via.placeholder.com/40'}
          alt="Admin"
          className="nav-profile"
        />
      </div>
    </div>
  );
};

export default Navbar;
