import React, { useEffect, useState } from 'react';
import './Customers.css';
import axios from 'axios';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    joined: '',
    totalOrders: ''
  });

  // Fetch all customers
  const fetchCustomers = async () => {
    try {
      const res = await axios.get('https://annieshop-backend.onrender.com');
      setCustomers(res.data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Add new customer
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/addcustomer', newCustomer);
      setNewCustomer({ name: '', email: '', joined: '', totalOrders: '' });
      fetchCustomers();
    } catch (err) {
      console.error("Error adding customer:", err);
    }
  };

  // Delete customer
  const handleDelete = async (id) => {
    try {
      await axios.post('http://localhost:4000/removecustomer', { id });
      fetchCustomers();
    } catch (err) {
      console.error("Error deleting customer:", err);
    }
  };

  return (
    <div className="customers-page">
      <h2>Customers</h2>

      {/* Add Customer Form */}
      <form className="add-customer-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Name"
          value={newCustomer.name}
          required
          onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newCustomer.email}
          required
          onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
        />
        <input
          type="date"
          value={newCustomer.joined}
          required
          onChange={(e) => setNewCustomer({ ...newCustomer, joined: e.target.value })}
        />
        <input
          type="number"
          placeholder="Total Orders"
          value={newCustomer.totalOrders}
          required
          onChange={(e) => setNewCustomer({ ...newCustomer, totalOrders: e.target.value })}
        />
        <button type="submit">Add Customer</button>
      </form>

      {/* Customer Table */}
      <table className="customers-table">
        <thead>
          <tr>
            <th>#ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Joined</th>
            <th>Total Orders</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.joined}</td>
              <td>{c.totalOrders}</td>
              <td>
                <button onClick={() => handleDelete(c.id)} className="delete-btn">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;
