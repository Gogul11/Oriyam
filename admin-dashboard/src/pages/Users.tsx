import React, { useEffect, useState } from "react";
import { getUsers } from "../api/adminApi";
import { Link } from "react-router-dom";

interface User {
  user_id: string;
  username?: string;
  email?: string;
  mobile?: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getUsers();

        setUsers(data.users || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <h2 className="loading-message">Loading Users...</h2>;

  return (
    <div className="lands-container">
      <h1>Users Management</h1>
      <ul className="land-card-grid">
        {users.map((u) => (
          <li key={u.user_id} className="land-card user-card">

            { }
            <h3>{u.username || u.email || 'User Details'}</h3>

            { }
            <div>
              <div className="card-detail">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{u.email || "N/A"}</span>
              </div>
              <div className="card-detail">
                <span className="detail-label">Mobile:</span>
                <span className="detail-value">{u.mobile || "N/A"}</span>
              </div>
              <div className="card-detail">
                <span className="detail-label">ID:</span>
                { }
                <span className="detail-value">{u.user_id.substring(0, 15)}...</span>
              </div>
            </div>

            { }
            <div className="card-actions">
              <Link to={`/admin/user/${u.user_id}`}>View Details</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;