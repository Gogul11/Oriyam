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

  if (loading)
    return (
      <h2 className="text-center text-2xl font-semibold text-green-600 animate-pulse mt-10">
        Loading land details...
      </h2>
    );

  if (!land)
    return (
      <h2 className="text-center text-xl text-gray-600 mt-10">
        Land not found.
      </h2>
    );

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg border border-green-200 p-8">
        {/* Title */}
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          {land.title || "Land Details"}
        </h1>

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-gray-800 mb-6">
          <p>
            <span className="font-medium text-gray-600">Land ID:</span>{" "}
            {land.landId}
          </p>
          <p>
            <span className="font-medium text-gray-600">Owner User ID:</span>{" "}
            {land.userId}
          </p>
          <p>
            <span className="font-medium text-gray-600">Location:</span>{" "}
            {land.village || "N/A"}, {land.subDistrict || "N/A"},{" "}
            {land.district || "N/A"}
          </p>
          <p>
            <span className="font-medium text-gray-600">Area:</span>{" "}
            {land.area || "N/A"} {land.unit || ""}
          </p>
          <p>
            <span className="font-medium text-gray-600">Rent Per Month:</span>{" "}
            ₹{land.rentPricePerMonth || "N/A"}
          </p>
          <p>
            <span className="font-medium text-gray-600">Soil Type:</span>{" "}
            {land.soilType || "N/A"}
          </p>
          <p>
            <span className="font-medium text-gray-600">Water Source:</span>{" "}
            {land.waterSource || "N/A"}
          </p>
          <p>
            <span className="font-medium text-gray-600">Available From:</span>{" "}
            {land.availabilityFrom || "N/A"}
          </p>
          <p>
            <span className="font-medium text-gray-600">Available To:</span>{" "}
            {land.availabilityTo || "N/A"}
          </p>
          {land.coordinates && (
            <p>
              <span className="font-medium text-gray-600">Coordinates:</span>{" "}
              {land.coordinates.lat}, {land.coordinates.lng}
            </p>
          )}
        </div>

        {/* Description */}
        {land.description && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-green-700 mb-2">
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed">{land.description}</p>
          </div>
        )}

        {/* Photos */}
        {land.photos && land.photos.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-green-700 mb-4">
              Photos
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {land.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`land-${index}`}
                  className="rounded-xl shadow-md border border-green-100 hover:shadow-xl transition-transform transform hover:scale-105 duration-300"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandDetails;
