import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import SalesChart from './SalesChart';
import CategoryBarChart from './CategoryBarChart';
import CustomerPieChart from './CustomerPieChart';
import API_BASE_URL from '../../config/api';

const weekdayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' });

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value || 0);

const formatCompactCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value || 0);

const getSalesSeries = (orders) => {
  const buckets = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return {
      key: date.toDateString(),
      name: weekdayFormatter.format(date),
      sales: 0,
    };
  });

  const bucketMap = new Map(buckets.map((item) => [item.key, item]));

  orders.forEach((order) => {
    const date = new Date(order.date);
    const key = date.toDateString();
    if (bucketMap.has(key)) {
      bucketMap.get(key).sales += Number(order.totalAmount || 0);
    }
  });

  return buckets.map(({ key, ...rest }) => rest);
};

const getCategorySeries = (products) => {
  const counts = products.reduce((accumulator, product) => {
    const category = product.category || 'Uncategorized';
    accumulator[category] = (accumulator[category] || 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(counts)
    .map(([category, orders]) => ({ category, orders }))
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 6);
};

const getCustomerMix = (customers) => {
  const returning = customers.filter((customer) => Number(customer.totalOrders || 0) > 1).length;
  const next = [
    { name: 'Returning', value: returning },
    { name: 'New', value: Math.max(customers.length - returning, 0) },
  ];

  return next.every((item) => item.value === 0)
    ? [{ name: 'New', value: 1 }]
    : next;
};

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        const [productsRes, ordersRes, customersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/allproducts`),
          axios.get(`${API_BASE_URL}/allorders`),
          axios.get(`${API_BASE_URL}/allcustomers`),
        ]);

        setProducts(productsRes.data || []);
        setOrders(ordersRes.data || []);
        setCustomers(customersRes.data || []);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Unable to load dashboard data right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const dashboardData = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
    const pendingOrders = orders.filter((order) => order.status?.toLowerCase() === 'pending').length;
    const preorderProducts = products.filter((product) => product.preorder).length;
    const popularProducts = products.filter((product) => product.popular).length;
    const returningCustomers = customers.filter((customer) => Number(customer.totalOrders || 0) > 1).length;
    const activeProducts = products.filter((product) => product.available !== false).length;

    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map((order) => ({
        id: `#${order.id}`,
        customer: order.customer?.name || 'Unknown customer',
        status: order.status || 'pending',
        total: formatCurrency(Number(order.totalAmount || 0)),
        date: new Date(order.date).toLocaleString(),
      }));

    return {
      summaryCards: [
        {
          label: 'Gross Revenue',
          value: formatCompactCurrency(totalRevenue),
          meta: `${orders.length} total orders processed`,
        },
        {
          label: 'Products Live',
          value: String(activeProducts),
          meta: `${popularProducts} marked as popular`,
        },
        {
          label: 'Orders in Flow',
          value: String(orders.length),
          meta: `${pendingOrders} still pending`,
        },
        {
          label: 'Customer Reach',
          value: String(customers.length),
          meta: `${returningCustomers} returning buyers`,
        },
      ],
      highlightMetrics: [
        {
          value: customers.length ? `${Math.round((returningCustomers / customers.length) * 100)}%` : '0%',
          label: 'traffic from repeat buyers',
        },
        {
          value: String(preorderProducts),
          label: 'products flagged for preorder',
        },
      ],
      salesSeries: getSalesSeries(orders),
      categorySeries: getCategorySeries(products),
      customerSeries: getCustomerMix(customers),
      recentOrders,
    };
  }, [customers, orders, products]);

  return (
    <div className="page-shell dashboard-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Seller performance at a glance</h2>
          <p className="page-subtitle">
            Your dashboard now reads straight from the backend, so revenue, inventory,
            orders, customers, and recent activity are based on live store data.
          </p>
        </div>
      </div>

      {error ? (
        <section className="admin-panel">
          <div className="empty-state">{error}</div>
        </section>
      ) : null}

      <section className="stat-grid">
        {dashboardData.summaryCards.map((card) => (
          <article key={card.label} className="stat-card">
            <div className="stat-card-label">{card.label}</div>
            <div className="stat-card-value">{loading ? '...' : card.value}</div>
            <div className="stat-card-meta">{card.meta}</div>
          </article>
        ))}
      </section>

      <section className="dashboard-highlight admin-panel">
        <div className="dashboard-highlight-copy">
          <span className="dashboard-highlight-badge">Command Center</span>
          <h3>Run the store with clearer signals, not clutter.</h3>
          <p>
            The top-level dashboard now combines live revenue, real order flow, customer
            mix, and product status so you can make faster admin decisions without
            jumping across screens.
          </p>
        </div>
        <div className="dashboard-highlight-metrics">
          {dashboardData.highlightMetrics.map((metric) => (
            <div key={metric.label}>
              <strong>{loading ? '...' : metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-charts">
        <SalesChart data={dashboardData.salesSeries} />
        <CategoryBarChart data={dashboardData.categorySeries} />
        <CustomerPieChart data={dashboardData.customerSeries} />
      </section>

      <section className="admin-panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">Recent orders</h3>
            <p className="panel-subtitle">Fast view of the latest movement across the store.</p>
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
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentOrders.length > 0 ? (
                dashboardData.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>
                      <span className={`status-pill ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{order.total}</td>
                    <td>{order.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-state">
                    {loading ? 'Loading orders...' : 'No orders available yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
