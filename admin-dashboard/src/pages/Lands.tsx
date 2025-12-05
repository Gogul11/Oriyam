import React, { useEffect, useState } from "react";
import { getLands } from "../api/adminApi";
import { Link } from "react-router-dom";

interface Land {
  landId: string;
  userId: string;
  title?: string;
  location?: string;
}

const Lands: React.FC = () => {
  const [lands, setLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLands = async () => {
      try {
        const data = await getLands();
        setLands(data.lands || []);
      } catch (error) {
        console.error("Error fetching lands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLands();
  }, []);

  if (loading)
    return (
      <h2 className="text-center text-2xl font-semibold text-green-600 animate-pulse mt-10">
        Loading Lands...
      </h2>
    );

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-green-50 to-white">
      <h1 className="text-3xl font-bold text-green-700 text-center mb-8">
        Land Listings Management
      </h1>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {lands.map((land) => (
          <li
            key={land.landId}
            className="bg-white shadow-lg hover:shadow-2xl border border-green-200 rounded-2xl p-6 transition-transform transform hover:-translate-y-2"
          >
            <h3 className="text-xl font-semibold text-green-700 mb-3">
              {land.title || "Untitled Land"}
            </h3>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Location:</span>
                <span className="text-gray-800">
                  {land.location || "Unknown"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Owner ID:</span>
                <span className="text-gray-800">
                  {land.userId
                    ? `${land.userId.substring(0, 15)}...`
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Land ID:</span>
                <span className="text-gray-800">
                  {land.landId.substring(0, 15)}...
                </span>
              </div>
            </div>

            <div className="text-center">
              <Link
                to={`/admin/land/${land.landId}`}
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

export default Lands;
