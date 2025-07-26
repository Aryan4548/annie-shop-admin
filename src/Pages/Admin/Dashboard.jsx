import React from 'react';
import './Dashboard.css';
import SalesChart from './SalesChart';
import CategoryBarChart from './CategoryBarChart';
import CustomerPieChart from './CustomerPieChart';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h2>Dashboard Overview</h2>

      {/* Stat Cards */}
      <div className="dashboard-cards">
        <div className="card">Total Sales<br /><strong>$12,430</strong></div>
        <div className="card">Total Products<br /><strong>120</strong></div>
        <div className="card">Orders<br /><strong>85</strong></div>
        <div className="card">Customers<br /><strong>240</strong></div>
      </div>

      {/* Charts */}
      <SalesChart />
      <CategoryBarChart />
      <CustomerPieChart />

      {/* Recent Orders Table */}
      <div className="dashboard-section">
        <h3>Recent Orders</h3>
        <table className="orders-table">
          <thead>
            <tr>
              <th>#ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#1023</td>
              <td>John Doe</td>
              <td>Shipped</td>
              <td>$123.00</td>
              <td>July 10</td>
            </tr>
            <tr>
              <td>#1024</td>
              <td>Jane Smith</td>
              <td>Pending</td>
              <td>$87.00</td>
              <td>July 11</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
