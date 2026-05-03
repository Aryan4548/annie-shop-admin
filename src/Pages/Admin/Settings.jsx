import React, { useEffect, useState } from 'react';
import './Settings.css';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

const Settings = () => {
  const [domain, setDomain] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [preorderAdvancePercentage, setPreorderAdvancePercentage] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/admin/settings`);
        if (res.data) {
          setDomain(res.data.domain || '');
          setEmail(res.data.email || '');
          setProfileImg(res.data.profileImage || '');
          setPreorderAdvancePercentage(res.data.preorderAdvancePercentage ?? 0);
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const handleProfileUpload = async () => {
    if (!selectedFile) return profileImg;
    const formData = new FormData();
    formData.append('profile', selectedFile);
    const res = await axios.post(`${API_BASE_URL}/upload/profile`, formData);
    return res.data.image_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const profileImage = await handleProfileUpload();

      const payload = {
        domain,
        email,
        profileImage,
        preorderAdvancePercentage: Number(preorderAdvancePercentage),
        ...(password && { password })
      };

      await axios.post(`${API_BASE_URL}/admin/settings`, payload);
      alert('Settings updated successfully');
      setPassword('');
    } catch (err) {
      console.error('Settings update failed:', err);
      alert('Update failed.');
    }
  };

  return (
    <div className="page-shell settings-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Store settings</h2>
          <p className="page-subtitle">
            Control your storefront identity, admin access, and pre-order payment
            rules from a single settings canvas.
          </p>
        </div>
      </div>

      <form className="settings-layout" onSubmit={handleSubmit}>
        <section className="admin-panel settings-main-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Business information</h3>
              <p className="panel-subtitle">Update how the store is represented across the admin experience.</p>
            </div>
          </div>

          <div className="settings-grid">
            <div className="settings-field">
              <label>Store Domain</label>
              <input
                className="admin-input"
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="example.com"
              />
            </div>

            <div className="settings-field">
              <label>Admin Email</label>
              <input
                className="admin-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>

            <div className="settings-field">
              <label>New Password</label>
              <input
                className="admin-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave empty to keep existing"
              />
            </div>

            <div className="settings-field">
              <label>Pre-Order Advance Percentage</label>
              <input
                className="admin-input"
                type="number"
                min="0"
                max="100"
                value={preorderAdvancePercentage}
                onChange={(e) => setPreorderAdvancePercentage(e.target.value)}
                placeholder="Enter a percentage between 0 and 100"
              />
            </div>
          </div>

          <div className="settings-actions">
            <button type="submit" className="admin-button">Save Settings</button>
          </div>
        </section>

        <aside className="admin-panel settings-side-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Profile image</h3>
              <p className="panel-subtitle">Upload the avatar shown in the admin header.</p>
            </div>
          </div>

          <div className="settings-side-content">
            <label className="settings-upload-label">
              <span>Choose image</span>
              <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
            </label>

            <div className="settings-preview-shell">
              {selectedFile ? (
                <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="profile-preview" />
              ) : (
                <img
                  src={profileImg || 'https://via.placeholder.com/140?text=Admin'}
                  alt="Current"
                  className="profile-preview"
                />
              )}
            </div>

            <div className="settings-note">
              <strong>Pre-order note</strong>
              <p>
                The advance percentage is a global setting and applies wherever you later
                connect preorder payment logic on the customer-facing storefront.
              </p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
};

export default Settings;
