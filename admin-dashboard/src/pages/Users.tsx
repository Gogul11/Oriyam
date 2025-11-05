import React, { useEffect, useState } from 'react';
import { getUsers } from '../api/adminApi';
import type { User } from '../api/adminApi';
import { Link } from 'react-router-dom';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers()
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <h1>👤 User Management</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Link to={`/admin/getUser/${user.id}`}>View Details</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;