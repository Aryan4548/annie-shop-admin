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

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('https://annieshop-backend.onrender.com/allcustomers');
      setCustomers(res.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://annieshop-backend.onrender.com/addcustomer', newCustomer);
      setNewCustomer({ name: '', email: '', joined: '', totalOrders: '' });
      fetchCustomers();
    } catch (err) {
      console.error('Error adding customer:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.post('https://annieshop-backend.onrender.com/removecustomer', { id });
      fetchCustomers();
    } catch (err) {
      console.error('Error deleting customer:', err);
    }
  };

  return (
    <div className="page-shell customers-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Customer relationships</h2>
          <p className="page-subtitle">
            Capture new customer records, review activity, and keep your relationship
            data organized in a cleaner CRM-style layout.
          </p>
        </div>
      </div>

      <section className="admin-panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">Add customer</h3>
            <p className="panel-subtitle">Quick entry form for manual customer records.</p>
          </div>
        </div>

        <form className="add-customer-form" onSubmit={handleAdd}>
          <input
            className="admin-input"
            type="text"
            placeholder="Name"
            value={newCustomer.name}
            required
            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
          />
          <input
            className="admin-input"
            type="email"
            placeholder="Email"
            value={newCustomer.email}
            required
            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
          />
          <input
            className="admin-input"
            type="date"
            value={newCustomer.joined}
            required
            onChange={(e) => setNewCustomer({ ...newCustomer, joined: e.target.value })}
          />
          <input
            className="admin-input"
            type="number"
            placeholder="Total Orders"
            value={newCustomer.totalOrders}
            required
            onChange={(e) => setNewCustomer({ ...newCustomer, totalOrders: e.target.value })}
          />
          <button className="admin-button" type="submit">Add Customer</button>
        </form>
      </section>

      <section className="admin-panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">Customer list</h3>
            <p className="panel-subtitle">Review all customer accounts created in the system.</p>
          </div>
        </div>

        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Total Orders</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>#{customer.id}</td>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.joined}</td>
                    <td>{customer.totalOrders}</td>
                    <td>
                      <button onClick={() => handleDelete(customer.id)} className="danger-button">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-state">No customers available yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Customers;
