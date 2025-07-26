import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductForm.css';

const ProductForm = ({ isOpen, onClose, onSave, editData }) => {
  const [form, setForm] = useState({
    name: '',
    category: '',
    subcategory: '',
    new_price: '',
    old_price: '',
    available: true,
    popular: false,
    description: '',
    images: []
  });

  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({ ...editData });
    } else {
      setForm({
        name: '',
        category: '',
        subcategory: '',
        new_price: '',
        old_price: '',
        available: true,
        popular: false,
        description: '',
        images: []
      });
    }
    setFiles([]);
    setUploadProgress({});
  }, [editData, isOpen]);

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    try {
      let imageUrls = [...form.images];

      if (files.length > 0) {
        setUploading(true);
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));

        const res = await axios.post('http://localhost:4000/upload/multiple', formData, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress({ total: percentCompleted });
          }
        });

        imageUrls = [...imageUrls, ...res.data.image_urls];
      }

      const payload = { ...form, images: imageUrls };

      if (editData) {
        await axios.post('http://localhost:4000/updateproduct', { id: form.id, ...payload });
      } else {
        await axios.post('http://localhost:4000/addproduct', payload);
      }

      setUploading(false);
      onSave();
      onClose();
    } catch (err) {
      console.error("Error saving product:", err);
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="product-form-modal">
      <div className="product-form-container">
        <h3>{editData ? 'Edit Product' : 'Add Product'}</h3>
        <div className="form-grid">
          {/* Image Upload Section */}
          <div className="image-upload-box">
            <label className="upload-label">
              <div className="upload-drag-box">
                <p>📁 Drop your files here or <span className="browse">Browse</span></p>
                <input type="file" multiple onChange={handleFileChange} />
              </div>
            </label>

            {/* ✅ Already Uploaded Images */}
            {form.images.length > 0 && (
              <div className="upload-preview-list">
                {form.images.map((url, i) => (
                  <div key={`uploaded-${i}`} className="upload-item">
                    <img src={url} alt={`uploaded-${i}`} />
                    <div>
                      <p>Uploaded</p>
                      <small>Stored</small>
                    </div>
                    <button onClick={() => removeImage(i)}>🗑️</button>
                  </div>
                ))}
              </div>
            )}

            {/* ✅ New Files */}
            {files.length > 0 && (
              <div className="upload-preview-list">
                {files.map((file, i) => (
                  <div key={`new-${i}`} className="upload-item">
                    <img src={URL.createObjectURL(file)} alt={`preview-${i}`} />
                    <div>
                      <p>{file.name}</p>
                      <small>{(file.size / 1024).toFixed(0)} KB</small>
                      {uploadProgress.total && uploading && (
                        <div className="progress-bar">
                          <div className="progress" style={{ width: `${uploadProgress.total}%` }}></div>
                        </div>
                      )}
                    </div>
                    <button onClick={() => removeFile(i)}>🗑️</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="details-form">
            <input type="text" name="name" placeholder="Product Name" value={form.name} onChange={handleInput} />
            <input type="text" name="category" placeholder="Category" value={form.category} onChange={handleInput} />
            <input type="text" name="subcategory" placeholder="Sub Category" value={form.subcategory} onChange={handleInput} />
            <input type="number" name="new_price" placeholder="New Price" value={form.new_price} onChange={handleInput} />
            <input type="number" name="old_price" placeholder="Old Price" value={form.old_price} onChange={handleInput} />
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleInput}></textarea>

            <div className="checkbox-group">
              <label><input type="checkbox" name="available" checked={form.available} onChange={handleInput} /> Available</label>
              <label><input type="checkbox" name="popular" checked={form.popular} onChange={handleInput} /> Popular</label>
            </div>

            <div className="form-actions">
              <button onClick={onClose}>Cancel</button>
              <button onClick={handleSubmit} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Publish Product'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
