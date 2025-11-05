// src/pages/Lands.tsx

import React, { useEffect, useState } from 'react';
import type { Land } from '../api/adminApi';
import { getLands } from '../api/adminApi';
import { Link } from 'react-router-dom';

const Lands: React.FC = () => {
  const [lands, setLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLands()
      .then(data => setLands(data))
      .catch(error => console.error('Error fetching lands:', error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading lands...</div>;

  return (
    <div>
      <h1>🏞️ Land Listings</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Location</th>
            <th>Owner ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lands.map(land => (
            <tr key={land.id}>
              <td>{land.id}</td>
              <td>{land.title}</td>
              <td>{land.location}</td>
              <td>{land.ownerId}</td>
              <td>
                <Link to={`/admin/getLand/${land.id}`}>View Details</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Lands;