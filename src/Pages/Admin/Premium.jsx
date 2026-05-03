import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import './Premium.css';

const formatDate = (value) => {
  if (!value) return 'Not subscribed yet';
  try {
    return new Date(value).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch (error) {
    return value;
  }
};

const Premium = () => {
  const [stats, setStats] = useState({
    premiumProducts: 0,
    totalSubscribers: 0,
    premiumRevenue: 0,
    conversionRate: 0,
  });
  const [premiumProducts, setPremiumProducts] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPremiumData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/admin/premium`);
        setStats(response.data.stats || {});
        setPremiumProducts(response.data.premiumProducts || []);
        setSubscribers(response.data.subscribers || []);
      } catch (error) {
        console.error('Failed to load premium admin data:', error);
        setStats({
          premiumProducts: 0,
          totalSubscribers: 0,
          premiumRevenue: 0,
          conversionRate: 0,
        });
        setPremiumProducts([]);
        setSubscribers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPremiumData();
  }, []);

  return (
    <div className="page-shell premium-admin-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Premium membership</h2>
          <p className="page-subtitle">
            Manage premium-only drops and keep an eye on who has activated the Rs. 499 membership.
          </p>
        </div>
      </div>

      <section className="premium-admin-hero admin-panel">
        <div className="premium-admin-copy">
          <span className="premium-admin-badge">Premium Console</span>
          <h3>Control your premium program from one place.</h3>
          <p>
            Mark products as premium-only from the product inventory, then track subscriber growth,
            revenue, and member access here.
          </p>
        </div>
        <div className="premium-admin-glance">
          <div>
            <strong>{stats.totalSubscribers || 0}</strong>
            <span>Premium members</span>
          </div>
          <div>
            <strong>{stats.premiumProducts || 0}</strong>
            <span>Premium products</span>
          </div>
        </div>
      </section>

      <section className="stat-grid">
        <article className="stat-card">
          <span className="stat-card-label">Premium Products</span>
          <p className="stat-card-value">{stats.premiumProducts || 0}</p>
          <span className="stat-card-meta">Products marked as premium-only</span>
        </article>
        <article className="stat-card">
          <span className="stat-card-label">Subscribers</span>
          <p className="stat-card-value">{stats.totalSubscribers || 0}</p>
          <span className="stat-card-meta">Users with active premium membership</span>
        </article>
        <article className="stat-card">
          <span className="stat-card-label">Revenue</span>
          <p className="stat-card-value">Rs. {Number(stats.premiumRevenue || 0).toLocaleString('en-IN')}</p>
          <span className="stat-card-meta">Estimated from active premium subscriptions</span>
        </article>
        <article className="stat-card">
          <span className="stat-card-label">Conversion</span>
          <p className="stat-card-value">{stats.conversionRate || 0}%</p>
          <span className="stat-card-meta">Share of users who upgraded</span>
        </article>
      </section>

      <div className="premium-admin-grid">
        <section className="admin-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Premium-only products</h3>
              <p className="panel-subtitle">
                These are the drops currently restricted to premium members.
              </p>
            </div>
          </div>

          <div className="table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Pre-order</th>
                </tr>
              </thead>
              <tbody>
                {!loading && premiumProducts.length > 0 ? (
                  premiumProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="premium-product-cell">
                          <img
                            src={product.images?.[0] || ''}
                            alt={product.name}
                            className="premium-product-thumb"
                          />
                          <div>
                            <strong>{product.name}</strong>
                            <span>{product.subcategory || 'General item'}</span>
                          </div>
                        </div>
                      </td>
                      <td>{product.category}</td>
                      <td>Rs. {Number(product.new_price || 0).toLocaleString('en-IN')}</td>
                      <td>{product.preorder ? 'Yes' : 'No'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      {loading ? 'Loading premium products...' : 'No premium-only products yet. Mark a product as Premium in Products.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Premium subscribers</h3>
              <p className="panel-subtitle">
                Members who have already activated premium access.
              </p>
            </div>
          </div>

          <div className="premium-subscriber-list">
            {!loading && subscribers.length > 0 ? (
              subscribers.map((subscriber) => (
                <article key={subscriber.id} className="premium-subscriber-card">
                  <div>
                    <strong>{subscriber.name}</strong>
                    <span>{subscriber.email}</span>
                    <small>{subscriber.phone || 'No phone added yet'}</small>
                  </div>
                  <div className="premium-subscriber-meta">
                    <span>Rs. {Number(subscriber.premiumPlanAmount || 499).toLocaleString('en-IN')}</span>
                    <small>{formatDate(subscriber.premiumSubscribedAt)}</small>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-state">
                {loading ? 'Loading subscribers...' : 'No premium subscribers yet.'}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Premium;
