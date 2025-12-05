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

  if (loading)
    return (
      <h2 className="text-center text-2xl font-semibold text-green-600 animate-pulse mt-10">
        Loading Users...
      </h2>
    );

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-green-50 to-white">
      <h1 className="text-3xl font-bold text-green-700 text-center mb-8">
        Users Management
      </h1>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {users.map((u) => (
          <li
            key={u.user_id}
            className="bg-white shadow-lg hover:shadow-2xl border border-green-200 rounded-2xl p-6 transition-transform transform hover:-translate-y-2"
          >
            <h3 className="text-xl font-semibold text-green-700 mb-3">
              {u.username || u.email || "User Details"}
            </h3>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Email:</span>
                <span className="text-gray-800">{u.email || "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Mobile:</span>
                <span className="text-gray-800">{u.mobile || "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">ID:</span>
                <span className="text-gray-800">
                  {u.user_id.substring(0, 15)}...
                </span>
              </div>
            </div>

            <div className="text-center">
              <Link
                to={`/admin/user/${u.user_id}`}
                className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300"
              >
                View Details
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
