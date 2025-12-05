import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const SidebarLayout: React.FC = () => {
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 rounded-md font-medium transition ${
      isActive
        ? "bg-lime-400 text-green-900 font-semibold"
        : "text-green-200 hover:bg-green-400 hover:text-green-900"
    }`;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-green-800 text-white flex flex-col p-4 shadow-lg">
        <h2 className="text-2xl font-bold text-lime-100 text-center mb-1">Oriyam</h2>
        <p className="text-center text-green-300 mb-6">Admin Panel</p>

        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <NavLink to="/admin/getUsers" className={linkClasses}>
                Users
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/getLands" className={linkClasses}>
                Lands
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white m-4 p-6 rounded-lg shadow-md overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;
