// src/layout/SidebarLayout.tsx

import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./sidebar.css";

const SidebarLayout: React.FC = () => {
  return (
    <div className="layout-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>

        <nav>
          <ul className="sidebar-menu">

            <li>
              <NavLink
                to="/admin/getUsers"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Users
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/getLands"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Lands
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/getUsersLand"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Users & Lands
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;
