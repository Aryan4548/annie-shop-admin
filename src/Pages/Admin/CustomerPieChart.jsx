import React from 'react';
import {
  PieChart, Pie, Tooltip, Cell, ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Returning', value: 300 },
  { name: 'New', value: 500 },
];

const COLORS = ['#ff7043', '#66bb6a'];

const CustomerPieChart = () => (
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
          outerRadius={80}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default CustomerPieChart;
