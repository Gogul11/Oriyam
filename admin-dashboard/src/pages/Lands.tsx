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

  if (loading) return <h2 className="loading-message">Loading Lands...</h2>;

  return (
    <div className="lands-container">
      <h1>Land Listings Management</h1>

      { }
      <ul className="land-card-grid">
        {lands.map((land) => (

          <li key={land.landId} className="land-card user-card">

            { }
            <h3>{land.title || "Untitled Land"}</h3>

            { }
            <div>
              <div className="card-detail">
                <span className="detail-label">Location:</span>
                <span className="detail-value">{land.location || "Unknown"}</span>
              </div>
              <div className="card-detail">
                <span className="detail-label">Owner ID:</span>
                { }
                <span className="detail-value">{land.userId ? `${land.userId.substring(0, 15)}...` : "N/A"}</span>
              </div>
              <div className="card-detail">
                <span className="detail-label">Land ID:</span>
                { }
                <span className="detail-value">{land.landId.substring(0, 15)}...</span>
              </div>
            </div>

            { }
            <div className="card-actions">
              <Link to={`/admin/land/${land.landId}`}>View Details</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Lands;
