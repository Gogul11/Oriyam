import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLandByIdApi } from "../api/adminApi";

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

const LandDetails: React.FC = () => {
  const { landId } = useParams<{ landId: string }>();
  const [land, setLand] = useState<Land | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (landId) {
      getLandByIdApi(landId)
        .then((data) => {
          setLand(data.land);
        })
        .catch((error) => console.error("Error fetching land details:", error))
        .finally(() => setLoading(false));
    }
  }, [landId]);

  if (loading) return <div>Loading land details...</div>;
  if (!land) return <div>Land not found.</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{land.title}</h1>

      <p><strong>Land ID:</strong> {land.landId}</p>
      <p><strong>Owner User ID:</strong> {land.userId}</p>
      <p><strong>Description:</strong> {land.description}</p>
      <p><strong>Location:</strong> {land.village}, {land.subDistrict}, {land.district}</p>
      <p><strong>Area:</strong> {land.area} {land.unit}</p>
      <p><strong>Rent Per Month:</strong> ₹{land.rentPricePerMonth}</p>
      <p><strong>Soil Type:</strong> {land.soilType}</p>
      <p><strong>Water Source:</strong> {land.waterSource}</p>

      <p><strong>Available From:</strong> {land.availabilityFrom}</p>
      <p><strong>Available To:</strong> {land.availabilityTo}</p>

      {land.coordinates && (
        <p>
          <strong>Coordinates:</strong> {land.coordinates.lat}, {land.coordinates.lng}
        </p>
      )}

      <h3>Photos</h3>
      <div style={{ display: "flex", gap: "10px" }}>
        {land.photos?.map((photo, index) => (
          <img
            key={index}
            src={`http://localhost:5000/uploads/${photo}`}
            alt={`land-${index}`}
            width={150}
            style={{ borderRadius: "8px" }}
          />
        ))}
      </div>
    </div>
  );
};

export default LandDetails;
