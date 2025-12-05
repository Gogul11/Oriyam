import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getUserByIdApi, getUsersLand } from "../api/adminApi";

interface User {
  user_id: string;
  username: string;
  email: string;
  mobile: string;
  age: number;
  goverment_id: string;
  gov_id_type: string;
  dateofbirth: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface Land {
  landId: string;
  userId: string;
  title: string;
  description?: string;
  area?: string;
  unit?: string;
  rentPricePerMonth?: string;
  soilType?: string;
  waterSource?: string;
  availabilityFrom?: string;
  availabilityTo?: string;
  district?: string;
  subDistrict?: string;
  village?: string;
  coordinates?: Coordinates;
  photos?: string[];
  status?: boolean;
}

const UserDetails = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [land, setLand] = useState<Land[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!userId) return;
        const res = await getUserByIdApi(userId);
        setUser(res.users);

        const landRes = await getUsersLand(userId);
        setLand(landRes.userLands);
      } catch (err) {
        console.error("Error loading user details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [userId]);

  if (loading)
    return (
      <h2 className="text-center text-2xl font-semibold text-green-600 animate-pulse mt-10">
        Loading user details...
      </h2>
    );

  if (!user)
    return (
      <h2 className="text-center text-xl text-gray-600 mt-10">
        No user found.
      </h2>
    );

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-green-50 to-white">
      <h1 className="text-3xl font-bold text-green-700 text-center mb-8">
        User Details
      </h1>

      {/* User Information Card */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl border border-green-200 p-6 mb-8">
        <h3 className="text-2xl font-semibold text-green-700 mb-4">
          User Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-gray-800">
          <p>
            <span className="font-medium text-gray-600">ID:</span>{" "}
            {user.user_id}
          </p>
          <p>
            <span className="font-medium text-gray-600">Username:</span>{" "}
            {user.username}
          </p>
          <p>
            <span className="font-medium text-gray-600">Email:</span>{" "}
            {user.email}
          </p>
          <p>
            <span className="font-medium text-gray-600">Mobile:</span>{" "}
            {user.mobile}
          </p>
          <p>
            <span className="font-medium text-gray-600">Age:</span> {user.age}
          </p>
          <p>
            <span className="font-medium text-gray-600">Gov ID:</span>{" "}
            {user.goverment_id}
          </p>
          <p>
            <span className="font-medium text-gray-600">ID Type:</span>{" "}
            {user.gov_id_type}
          </p>
          <p>
            <span className="font-medium text-gray-600">Date of Birth:</span>{" "}
            {user.dateofbirth}
          </p>
        </div>
      </div>

      {/* Land Information Section */}
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl font-semibold text-green-700 mb-4">
          Land Information
        </h3>

        {land && land.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {land.map((l, idx) => (
              <li
                key={idx}
                className="bg-white shadow-md hover:shadow-2xl border border-green-200 rounded-2xl p-6 transition-transform transform hover:-translate-y-2"
              >
                <h4 className="text-xl font-semibold text-green-700 mb-2">
                  {l.title || "Untitled Land"}
                </h4>

                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-medium text-gray-600">Land ID:</span>{" "}
                  {l.landId.substring(0, 15)}...
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-medium text-gray-600">Owner ID:</span>{" "}
                  {l.userId.substring(0, 15)}...
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-medium text-gray-600">Description:</span>{" "}
                  {l.description || "N/A"}
                </p>
                <p className="text-sm text-gray-700 mb-3">
                  <span className="font-medium text-gray-600">Location:</span>{" "}
                  {l.village || "N/A"}, {l.subDistrict || "N/A"},{" "}
                  {l.district || "N/A"}
                </p>

                <Link
                  to={`/admin/land/${l.landId}`}
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300 text-sm"
                >
                  View Details
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-center">No lands found for this user.</p>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
