import React, { useEffect, useState } from 'react';
import './Products.css';
import axios from 'axios';
import Papa from 'papaparse';
import ProductForm from './ProductForm';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('https://annieshop-backend.onrender.com/allproducts');
      setProducts(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setFiltered(products.filter(p => p.name.toLowerCase().includes(query)));
  };

  const handleDelete = async (id) => {
    try {
      await axios.post('https://annieshop-backend.onrender.com/removeproduct', { id });
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const togglePopular = async (id, isPopular) => {
    try {
      const res = await axios.post('https://annieshop-backend.onrender.com/togglepopular', {
        id,
        popular: !isPopular
      });
      const updated = products.map(p => p.id === id ? res.data.updated : p);
      setProducts(updated);
      setFiltered(updated);
    } catch (err) {
      console.error("Failed to toggle popular:", err);
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
            await axios.post('https://annieshop-backend.onrender.com/addproduct', product);
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
        complete: async function (results) {
          for (const product of results.data) {
            try {
              await axios.post('https://annieshop-backend.onrender.com/addproduct', product);
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
    <div className="products">
      <div className="products-header">
        <h2>Products</h2>
        <div className="actions">
          <label htmlFor="bulk-upload" className="bulk-upload-label">
            📤 Bulk Import (.json or .csv)
          </label>
          <input id="bulk-upload" type="file" accept=".json,.csv" onChange={handleBulkUpload} style={{ display: 'none' }} />
          <button onClick={() => { setEditProduct(null); setShowForm(true); }}>+ Add Product</button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search products..."
        onChange={handleSearch}
        className="search-input"
      />

      <table className="products-table">
        <thead>
          <tr>
            <th>#ID</th>
            <th>Images</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price (New)</th>
            <th>Stock</th>
            <th>Popular</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>
                {p.images && p.images.map((img, idx) => (
                  <img key={idx} src={img} alt={p.name} height="40" style={{ marginRight: '5px' }} />
                ))}
              </td>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>${p.new_price}</td>
              <td>{p.available ? 'In Stock' : 'Out'}</td>
              <td>
                <input
                  type="checkbox"
                  checked={p.popular}
                  onChange={() => togglePopular(p.id, p.popular)}
                />
              </td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id)} className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ProductForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditProduct(null); }}
        onSave={fetchProducts}
        editData={editProduct}
      />
    </div>
  );
};

export default Products;
