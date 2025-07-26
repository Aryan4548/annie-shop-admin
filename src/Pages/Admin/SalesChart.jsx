import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Mon', sales: 1200 },
  { name: 'Tue', sales: 2100 },
  { name: 'Wed', sales: 800 },
  { name: 'Thu', sales: 1600 },
  { name: 'Fri', sales: 900 },
  { name: 'Sat', sales: 1700 },
  { name: 'Sun', sales: 2500 },
];

const SalesChart = () => (
  <div className="chart-container">
    <h3>Weekly Sales</h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default SalesChart;
