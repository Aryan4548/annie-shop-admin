import React, { useEffect, useState } from 'react';
import './Products.css';
import axios from 'axios';
import Papa from 'papaparse';
import ProductForm from './ProductForm';
import API_BASE_URL from '../../config/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/allproducts`);
      setProducts(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setFiltered(products.filter((p) => p.name.toLowerCase().includes(query)));
  };

  const handleDelete = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/removeproduct`, { id });
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const togglePopular = async (id, isPopular) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/togglepopular`, {
        id,
        popular: !isPopular,
      });
      const updated = products.map((p) => (p.id === id ? res.data.updated : p));
      setProducts(updated);
      setFiltered(updated);
    } catch (err) {
      console.error('Failed to toggle popular:', err);
    }
  };

  const togglePreorder = async (id, isPreorder) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/togglepreorder`, {
        id,
        preorder: !isPreorder,
      });
      const updated = products.map((p) => (p.id === id ? res.data.updated : p));
      setProducts(updated);
      setFiltered(updated);
    } catch (err) {
      console.error('Failed to toggle pre-order:', err);
    }
  };

  const togglePremiumOnly = async (id, isPremiumOnly) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/togglepremiumproduct`, {
        id,
        premiumOnly: !isPremiumOnly,
      });
      const updated = products.map((p) => (p.id === id ? res.data.updated : p));
      setProducts(updated);
      setFiltered(updated);
    } catch (err) {
      console.error('Failed to toggle premium-only:', err);
    }
  };

  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const extension = file.name.split('.').pop().toLowerCase();

    if (extension === 'json') {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const productArray = JSON.parse(event.target.result);
          for (const product of productArray) {
            await axios.post(`${API_BASE_URL}/addproduct`, product);
          }
          fetchProducts();
        } catch (err) {
          console.error('Invalid JSON:', err);
        }
      };
      reader.readAsText(file);
    } else if (extension === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          for (const product of results.data) {
            try {
              await axios.post(`${API_BASE_URL}/addproduct`, product);
            } catch (err) {
              console.error('Error adding from CSV row:', err);
            }
          }
          fetchProducts();
        },
      });
    } else {
      alert('Unsupported file type. Please upload a .json or .csv file.');
    }
  };

  return (
    <div className="page-shell products-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Catalog management</h2>
          <p className="page-subtitle">
            Update inventory, highlight bestsellers, and mark products for pre-order
            from one cleaner storefront workspace.
          </p>
        </div>
        <div className="surface-toolbar">
          <label htmlFor="bulk-upload" className="admin-button-secondary bulk-upload-label">
            Import JSON or CSV
          </label>
          <input
            id="bulk-upload"
            type="file"
            accept=".json,.csv"
            onChange={handleBulkUpload}
            style={{ display: 'none' }}
          />
          <button
            className="admin-button"
            onClick={() => {
              setEditProduct(null);
              setShowForm(true);
            }}
          >
            Add Product
          </button>
        </div>
      </div>

      <section className="admin-panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">Product inventory</h3>
            <p className="panel-subtitle">Search, edit, and feature products with faster visibility.</p>
          </div>
          <div className="products-search-shell">
            <input
              type="text"
              placeholder="Search products..."
              onChange={handleSearch}
              className="admin-input search-input"
            />
          </div>
        </div>

        <div className="table-scroll">
          <table className="admin-table products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Popular</th>
                <th>Pre-Order</th>
                <th>Premium</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((p) => (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td>
                      <div className="product-cell">
                        <div className="product-thumbs">
                          {p.images && p.images.length > 0 ? (
                            p.images.slice(0, 2).map((img, idx) => (
                              <img key={idx} src={img} alt={p.name} className="product-thumb" />
                            ))
                          ) : (
                            <div className="product-thumb product-thumb-fallback">NA</div>
                          )}
                        </div>
                        <div className="product-meta">
                          <strong>{p.name}</strong>
                          <span>{p.subcategory || 'General item'}</span>
                        </div>
                      </div>
                    </td>
                    <td>{p.category}</td>
                    <td>
                      <div className="price-stack">
                        <strong>${p.new_price}</strong>
                        {p.old_price ? <span>${p.old_price}</span> : null}
                      </div>
                    </td>
                    <td>
                      <span className={`stock-pill ${p.available ? 'available' : 'out'}`}>
                        {p.available ? 'In Stock' : 'Out'}
                      </span>
                    </td>
                    <td>
                      <input
                        className="toggle-input"
                        type="checkbox"
                        checked={p.popular}
                        onChange={() => togglePopular(p.id, p.popular)}
                      />
                    </td>
                    <td>
                      <input
                        className="toggle-input"
                        type="checkbox"
                        checked={!!p.preorder}
                        onChange={() => togglePreorder(p.id, p.preorder)}
                      />
                    </td>
                    <td>
                      <input
                        className="toggle-input"
                        type="checkbox"
                        checked={!!p.premiumOnly}
                        onChange={() => togglePremiumOnly(p.id, p.premiumOnly)}
                      />
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="admin-button-secondary" onClick={() => handleEdit(p)}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="danger-button">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="empty-state">No products found for this search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <ProductForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditProduct(null);
        }}
        onSave={fetchProducts}
        editData={editProduct}
      />
    </div>
  );
};

export default Products;
