import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './Categories.css';
import API_BASE_URL from '../../config/api';

const initialFormState = {
  id: null,
  name: '',
  slug: '',
  image: '',
  highlighted: true,
  displayOrder: 0,
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0) || a.id - b.id),
    [categories]
  );

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(res.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setForm(initialFormState);
    setSelectedFile(null);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEdit = (category) => {
    setForm({
      id: category.id,
      name: category.name || '',
      slug: category.slug || '',
      image: category.image || '',
      highlighted: Boolean(category.highlighted),
      displayOrder: category.displayOrder ?? 0,
    });
    setSelectedFile(null);
    setMessage('');
  };

  const uploadCategoryImage = async () => {
    if (!selectedFile) {
      return form.image;
    }

    const data = new FormData();
    data.append('file', selectedFile);
    const response = await axios.post(`${API_BASE_URL}/upload`, data);
    return response.data.image_url;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      const image = await uploadCategoryImage();
      const payload = {
        ...form,
        image,
        displayOrder: Number(form.displayOrder) || 0,
      };

      const endpoint = form.id ? '/updatecategory' : '/addcategory';
      await axios.post(`${API_BASE_URL}${endpoint}`, payload);
      await fetchCategories();
      resetForm();
      setMessage(form.id ? 'Category updated successfully.' : 'Category added successfully.');
    } catch (error) {
      console.error('Failed to save category:', error);
      setMessage(error.response?.data?.message || 'Unable to save category right now.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/removecategory`, { id });
      if (form.id === id) {
        resetForm();
      }
      await fetchCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const handleToggleHighlight = async (category) => {
    try {
      await axios.post(`${API_BASE_URL}/togglecategoryhighlight`, {
        id: category.id,
        highlighted: !category.highlighted,
      });
      await fetchCategories();
    } catch (error) {
      console.error('Failed to toggle highlight:', error);
    }
  };

  return (
    <div className="page-shell categories-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Category management</h2>
          <p className="page-subtitle">
            Control the shared category row and catalog strip from one place.
            Highlighted categories appear on the storefront and inside the catalog filter rail.
          </p>
        </div>
      </div>

      <div className="categories-layout">
        <section className="admin-panel categories-form-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">{form.id ? 'Edit category' : 'Add category'}</h3>
              <p className="panel-subtitle">Set the title, image, storefront visibility, and display order.</p>
            </div>
          </div>

          <form className="categories-form" onSubmit={handleSubmit}>
            <div className="categories-grid">
              <div className="settings-field">
                <label>Category Name</label>
                <input
                  className="admin-input"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Pre Orders"
                  required
                />
              </div>

              <div className="settings-field">
                <label>Slug</label>
                <input
                  className="admin-input"
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="pre-orders"
                />
              </div>

              <div className="settings-field">
                <label>Display Order</label>
                <input
                  className="admin-input"
                  type="number"
                  name="displayOrder"
                  value={form.displayOrder}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>

              <label className="categories-highlight-toggle">
                <input
                  className="toggle-input"
                  type="checkbox"
                  name="highlighted"
                  checked={form.highlighted}
                  onChange={handleChange}
                />
                <div>
                  <strong>Highlighted category</strong>
                  <span>Show this category in the homepage row and the catalog strip.</span>
                </div>
              </label>
            </div>

            <div className="categories-image-row">
              <div className="settings-field category-image-input">
                <label>Category Image</label>
                <input
                  className="admin-input"
                  type="file"
                  accept="image/*"
                  onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                />
              </div>

              <div className="category-image-preview">
                {selectedFile ? (
                  <img src={URL.createObjectURL(selectedFile)} alt="Selected category" />
                ) : form.image ? (
                  <img src={form.image} alt={form.name || 'Category'} />
                ) : (
                  <span>{(form.name || 'CA').slice(0, 2).toUpperCase()}</span>
                )}
              </div>
            </div>

            {message ? <p className="categories-message">{message}</p> : null}

            <div className="settings-actions">
              <button type="submit" className="admin-button" disabled={isSaving}>
                {isSaving ? 'Saving...' : form.id ? 'Update Category' : 'Add Category'}
              </button>
              <button type="button" className="admin-button-secondary" onClick={resetForm}>
                Clear
              </button>
            </div>
          </form>
        </section>

        <section className="admin-panel categories-list-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Shared category list</h3>
              <p className="panel-subtitle">These categories power both highlighted storefront sections.</p>
            </div>
          </div>

          <div className="table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Category</th>
                  <th>Slug</th>
                  <th>Highlighted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedCategories.length > 0 ? (
                  sortedCategories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.displayOrder ?? 0}</td>
                      <td>
                        <div className="category-table-cell">
                          <div className="category-table-thumb">
                            {category.image ? (
                              <img src={category.image} alt={category.name} />
                            ) : (
                              <span>{category.name.slice(0, 2).toUpperCase()}</span>
                            )}
                          </div>
                          <div className="category-table-copy">
                            <strong>{category.name}</strong>
                            <span>ID #{category.id}</span>
                          </div>
                        </div>
                      </td>
                      <td>{category.slug}</td>
                      <td>
                        <input
                          className="toggle-input"
                          type="checkbox"
                          checked={Boolean(category.highlighted)}
                          onChange={() => handleToggleHighlight(category)}
                        />
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="admin-button-secondary" onClick={() => handleEdit(category)}>
                            Edit
                          </button>
                          <button className="danger-button" onClick={() => handleDelete(category.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-state">No categories available yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Categories;
