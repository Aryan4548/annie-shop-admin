import React, { useEffect, useState } from 'react';
import './Settings.css';
import axios from 'axios';

const Settings = () => {
  const [domain, setDomain] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // Load current settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('https://annieshop-backend.onrender.com/admin/settings');
        if (res.data) {
          setDomain(res.data.domain || '');
          setEmail(res.data.email || '');
          setProfileImg(res.data.profileImage || '');
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const handleProfileUpload = async () => {
    if (!selectedFile) return profileImg;
    const formData = new FormData();
    formData.append('profile', selectedFile);
    const res = await axios.post('https://annieshop-backend.onrender.com/upload/profile', formData);
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
        ...(password && { password }) // include only if password is filled
      };

      await axios.post('https://annieshop-backend.onrender.com/admin/settings', payload);
      alert('Settings updated successfully!');
      setPassword('');
    } catch (err) {
      console.error('Settings update failed:', err);
      alert('Update failed.');
    }
  };

  return (
    <div className="settings-container">
      <h2>Admin Settings</h2>
      <form onSubmit={handleSubmit}>
        <label>Store Domain</label>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="example.com"
        />

        <label>Admin Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
        />

        <label>New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Leave empty to keep existing"
        />

        <label>Profile Picture</label>
        <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />

        {selectedFile ? (
          <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="profile-preview" />
        ) : (
          profileImg && <img src={profileImg} alt="Current" className="profile-preview" />
        )}

        <button type="submit">Save Settings</button>
      </form>
    </div>
  );
};

export default Settings;
