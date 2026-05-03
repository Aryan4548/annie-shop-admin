import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const SalesChart = ({ data = [] }) => (
  <div className="chart-container">
    <h3>Weekly Sales</h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey="name" stroke="#6b7b8d" tickLine={false} axisLine={false} />
        <YAxis stroke="#6b7b8d" tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ background: '#0f1724', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px' }}
          labelStyle={{ color: '#f4f8fb' }}
        />
        <Line type="monotone" dataKey="sales" stroke="#7dd3fc" strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default SalesChart;
