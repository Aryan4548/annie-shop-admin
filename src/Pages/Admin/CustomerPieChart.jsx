import React from 'react';
import {
  PieChart, Pie, Tooltip, Cell, ResponsiveContainer
} from 'recharts';

const COLORS = ['#7dd3fc', '#facc15'];

const CustomerPieChart = ({ data = [] }) => (
  <div className="chart-container">
    <h3>Customer Types</h3>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={92}
          innerRadius={46}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: '#0f1724', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px' }}
          labelStyle={{ color: '#f4f8fb' }}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default CustomerPieChart;
