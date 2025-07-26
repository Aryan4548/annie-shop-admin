import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Sidebar from './Components/Sidebar/Sidebar';
import Dashboard from './Pages/Admin/Dashboard';
import Products from './Pages/Admin/Products';
import Orders from './Pages/Admin/Orders';
import Customers from './Pages/Admin/Customers';
import Settings from './Pages/Admin/Settings';
import AdminLogin from './Pages/Admin/AdminLogin';
import ProtectedRoute from './Pages/Admin/ProtectedRoute';
import './App.css';

const AdminLayout = () => (
  <>
    <Navbar />
    <div className="main-container">
      <Sidebar />
      <div className="content-area">
        <Outlet />
      </div>
    </div>
  </>
);

const App = () => {
  return (
    <Routes>
      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/admin-login" replace />} />
      
      <Route path="/admin-login" element={<AdminLogin />} />
      
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
