// src/pages/UsersLand.tsx

import React, { useEffect, useState } from 'react';
import { getUsersLand } from '../api/adminApi';
import type { Land } from '../api/adminApi';

const UsersLand: React.FC = () => {
  const [lands, setLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsersLand()
      .then(data => setLands(data))
      .catch(error => console.error('Error fetching user lands:', error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading user land data...</div>;

  return (
    <div>
      <h1>🤝 Users & Lands Overview</h1>
      <p>This page typically shows a **relationship overview** between users and their owned/associated lands. Below is a list of all lands:</p>
      
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Owner ID</th>
          </tr>
        </thead>
        <tbody>
          {lands.map(land => (
            <tr key={land.id}>
              <td>{land.id}</td>
              <td>{land.title}</td>
              <td>{land.ownerId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersLand;