import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Orders.css';
import API_BASE_URL from '../../config/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/allorders`);
      const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setOrders(sorted);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = orders.filter((order) =>
    order.customer.name.toLowerCase().includes(query.toLowerCase()) ||
    order.status.toLowerCase().includes(query.toLowerCase())
  );

  const handleView = (order) => {
    setSelectedOrder(order);
    setStatus(order.status);
  };

  const handleUpdateStatus = async () => {
    try {
      await axios.post(`${API_BASE_URL}/updateorderstatus`, {
        id: selectedOrder.id,
        status,
      });
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      alert('Failed to update status');
      console.error(err);
    }
  };

  return (
    <div className="page-shell orders-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Order operations</h2>
          <p className="page-subtitle">
            Review incoming orders, inspect customer details, and update fulfillment
            status from a calmer, more readable operations table.
          </p>
        </div>
      </div>

      <section className="admin-panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">Order queue</h3>
            <p className="panel-subtitle">Filter by customer name or status and open any order for detail view.</p>
          </div>
          <div className="orders-search-shell">
            <input
              className="admin-input"
              type="text"
              placeholder="Search by customer or status..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customer.name}</td>
                    <td>
                      <span className={`status-pill ${order.status.toLowerCase()}`}>{order.status}</span>
                    </td>
                    <td>Rs {Number(order.totalAmount).toFixed(2)}</td>
                    <td>{new Date(order.date).toLocaleString()}</td>
                    <td>
                      <button className="admin-button-secondary" onClick={() => handleView(order)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-state">No orders match the current search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h3>Order #{selectedOrder.id}</h3>
                <p>Detailed customer and item breakdown for this purchase.</p>
              </div>
              <button className="admin-button-ghost" onClick={() => setSelectedOrder(null)}>
                Close
              </button>
            </div>

            <div className="modal-grid">
              <div className="modal-card">
                <span className="modal-label">Customer</span>
                <strong>{selectedOrder.customer.name}</strong>
                <p>{selectedOrder.customer.email}</p>
                <p>{selectedOrder.customer.phone}</p>
              </div>
              <div className="modal-card">
                <span className="modal-label">Shipping Address</span>
                <strong>{selectedOrder.customer.city}, {selectedOrder.customer.state}</strong>
                <p>
                  {selectedOrder.customer.address1}, {selectedOrder.customer.address2}
                </p>
                <p>
                  {selectedOrder.customer.postalCode}, {selectedOrder.customer.country}
                </p>
              </div>
            </div>

            <div className="modal-products-shell">
              <h4>Products</h4>
              <ul className="modal-products">
                {selectedOrder.products.map((product, idx) => (
                  <li key={`${product.name}-${idx}`} className="modal-product">
                    <div className="modal-product-copy">
                      <strong>{product.name}</strong>
                      <span>Qty {product.quantity}</span>
                    </div>
                    <strong>Rs {product.new_price * product.quantity}</strong>
                  </li>
                ))}
              </ul>
            </div>

            <div className="status-update">
              <label htmlFor="order-status">Update status</label>
              <select
                id="order-status"
                className="admin-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="success">Success</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button className="admin-button" onClick={handleUpdateStatus}>Save Status</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
