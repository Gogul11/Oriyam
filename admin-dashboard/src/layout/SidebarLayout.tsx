// src/layout/SidebarLayout.tsx

import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './sidebar.css'; // Import your CSS

const SidebarLayout: React.FC = () => {
  return (
    <div className="layout-container">
      <nav className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li>
            <Link to="/admin/getUsers">Users</Link>
          </li>
          <li>
            <Link to="/admin/getLands">Lands</Link>
          </li>
          <li>
            <Link to="/admin/getUsersLand">Users & Lands</Link>
          </li>
        </ul>
      </nav>
      <main className="content">
        <Outlet /> {/* Renders the current route's page component */}
      </main>
    </div>
  );
};

export default SidebarLayout;