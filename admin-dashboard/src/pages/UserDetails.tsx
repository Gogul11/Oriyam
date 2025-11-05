// src/pages/UserDetails.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { User } from '../api/adminApi';
import { getUserDetails } from '../api/adminApi';

const UserDetails: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      getUserDetails(userId)
        .then(data => setUser(data))
        .catch(error => console.error('Error fetching user details:', error))
        .finally(() => setLoading(false));
    }
  }, [userId]);

  if (loading) return <div>Loading user details...</div>;
  if (!user) return <div>User not found.</div>;

  return (
    <div>
      <h1>User Details: **{user.name}**</h1>
      <p>ID: {user.id}</p>
      <p>Email: {user.email}</p>
      <p>Role: **{user.role}**</p>
      {/* Add more detailed user information here */}
    </div>
  );
};

export default UserDetails;