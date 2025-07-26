import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

const data = [
  { category: 'Clothing', orders: 120 },
  { category: 'Shoes', orders: 90 },
  { category: 'Accessories', orders: 65 },
  { category: 'Beauty', orders: 50 },
];

const CategoryBarChart = () => (
  <div className="chart-container">
    <h3>Orders by Category</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="orders" fill="#00bcd4" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default CategoryBarChart;
