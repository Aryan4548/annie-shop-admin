import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:4000/allorders');
      const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setOrders(sorted);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };
  fetchOrders();
}, []);


  const filtered = orders.filter(order =>
    order.customer.name.toLowerCase().includes(query.toLowerCase()) ||
    order.status.toLowerCase().includes(query.toLowerCase())
  );

  const handleView = (order) => {
    setSelectedOrder(order);
    setStatus(order.status);
  };

  const handleUpdateStatus = async () => {
    try {
      await axios.post('http://localhost:4000/updateorderstatus', {
        id: selectedOrder.id,
        status
      });
      setSelectedOrder(null);
      fetchOrders(); // refresh orders
    } catch (err) {
      alert("Failed to update status");
      console.error(err);
    }
  };

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h2>Orders</h2>
        <input
          type="text"
          placeholder="Search by customer or status..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      <table className="orders-table">
        <thead>
          <tr>
            <th>#ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Total</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer.name}</td>
              <td><span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></td>
              <td>₹{order.totalAmount.toFixed(2)}</td>
              <td>{new Date(order.date).toLocaleString()}</td>
              <td>
                <button onClick={() => handleView(order)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Order #{selectedOrder.id} Details</h3>
            <p><strong>Customer:</strong> {selectedOrder.customer.name}</p>
            <p><strong>Email:</strong> {selectedOrder.customer.email}</p>
            <p><strong>Phone:</strong> {selectedOrder.customer.phone}</p>
            <p><strong>Address:</strong> {`${selectedOrder.customer.address1}, ${selectedOrder.customer.address2}, ${selectedOrder.customer.city}, ${selectedOrder.customer.state} - ${selectedOrder.customer.postalCode}, ${selectedOrder.customer.country}`}</p>

            <h4>Products:</h4>
            <ul className="modal-products">
              {selectedOrder.products.map((p, idx) => (
                <li key={idx} className="modal-product">
                  <img src={`http://localhost:4000/images/${p.image}`} alt={p.name} />
                  <span>{p.name} × {p.quantity} = ₹{p.new_price * p.quantity}</span>
                </li>
              ))}
            </ul>

            <div className="status-update">
              <label>Update Status:</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="success">Success</option>
              </select>
              <button onClick={handleUpdateStatus}>Save</button>
            </div>

            <button className="close-btn" onClick={() => setSelectedOrder(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
