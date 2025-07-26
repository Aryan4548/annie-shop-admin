import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const isAdminAuthenticated = () => {
  const token = localStorage.getItem('adminToken');
  return !!token;
};

// ✅ Now correctly renders nested <Route> using <Outlet />
const ProtectedRoute = () => {
  return isAdminAuthenticated() ? <Outlet /> : <Navigate to="/admin-login" replace />;
};

export default ProtectedRoute;
