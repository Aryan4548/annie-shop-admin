import React, { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', key: 'DB' },
  { label: 'Products', path: '/admin/products', key: 'PR' },
  { label: 'Categories', path: '/admin/categories', key: 'CT' },
  { label: 'Premium', path: '/admin/premium', key: 'PM' },
  { label: 'Orders', path: '/admin/orders', key: 'OR' },
  { label: 'Customers', path: '/admin/customers', key: 'CU' },
  { label: 'Settings', path: '/admin/settings', key: 'ST' },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const shellClass = useMemo(
    () => `sidebar ${isOpen ? 'open' : 'collapsed'}`,
    [isOpen]
  );

  return (
    <aside className={shellClass}>
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">AS</div>
        {isOpen && (
          <div>
            <p className="sidebar-eyebrow">Seller Console</p>
            <h1>Annie Shop</h1>
          </div>
        )}
        <button
          type="button"
          className="sidebar-toggle"
          onClick={() => setIsOpen((value) => !value)}
          aria-label="Toggle sidebar"
        >
          {isOpen ? '<' : '>'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-icon">{item.key}</span>
            {isOpen && <span className="sidebar-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-support">
          <span className="sidebar-support-dot" />
          {isOpen && (
            <div>
              <strong>Live Store</strong>
              <p>Manage products, orders, and pre-orders.</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
