import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

const CategoryBarChart = ({ data = [] }) => (
  <div className="chart-container">
    <h3>Products by Category</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey="category" stroke="#6b7b8d" tickLine={false} axisLine={false} />
        <YAxis stroke="#6b7b8d" tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ background: '#0f1724', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px' }}
          labelStyle={{ color: '#f4f8fb' }}
        />
        <Bar dataKey="orders" fill="#facc15" radius={[10, 10, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default CategoryBarChart;
