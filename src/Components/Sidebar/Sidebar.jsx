import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </div>
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/admin/dashboard" className="sidebar-link" activeclassname="active">
            {isOpen && <span>Dashboard</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/products" className="sidebar-link" activeclassname="active">
            {isOpen && <span>Products</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/orders" className="sidebar-link" activeclassname="active">
            {isOpen && <span>Orders</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/customers" className="sidebar-link" activeclassname="active">
            {isOpen && <span>Customers</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/settings" className="sidebar-link" activeclassname="active">
            {isOpen && <span>Settings</span>}
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
