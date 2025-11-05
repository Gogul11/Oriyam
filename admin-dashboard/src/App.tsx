// src/App.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import SidebarLayout from './layout/SidebarLayout';

// Pages
import Users from './pages/Users';
import UserDetails from './pages/UserDetails';
import Lands from './pages/Lands';
import LandDetails from './pages/LandDetails';
import UsersLand from './pages/UsersLand';

import './App.css'; // For general app styles

const App: React.FC = () => {
  return (
      <Routes>
        {/* Redirecting the root path to the admin dashboard for this example */}
        <Route path="/" element={<Navigate to="/admin/getUsers" replace />} />

        {/* All admin routes use the SidebarLayout */}
        <Route path="/admin" element={<SidebarLayout />}>
          
          {/* Default page for /admin - redirect to Users list */}
          <Route index element={<Navigate to="getUsers" replace />} />

          {/* User Routes */}
          <Route path="getUsers" element={<Users />} />
          <Route path="getUser/:userId" element={<UserDetails />} />

          {/* Land Routes */}
          <Route path="getLands" element={<Lands />} />
          <Route path="getLand/:landId" element={<LandDetails />} />
          
          {/* Combined Route */}
          <Route path="getUsersLand" element={<UsersLand />} />
          
          {/* 404/Catch-all inside admin dashboard */}
          <Route path="*" element={<h2>404 - Admin Route Not Found</h2>} />

        </Route>

        {/* Global 404 */}
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
  );
};

export default App;