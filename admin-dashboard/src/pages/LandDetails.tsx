// src/pages/LandDetails.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLandDetails} from '../api/adminApi';
import type { Land } from '../api/adminApi';

const LandDetails: React.FC = () => {
  const { landId } = useParams<{ landId: string }>();
  const [land, setLand] = useState<Land | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (landId) {
      getLandDetails(landId)
        .then(data => setLand(data))
        .catch(error => console.error('Error fetching land details:', error))
        .finally(() => setLoading(false));
    }
  }, [landId]);

  if (loading) return <div>Loading land details...</div>;
  if (!land) return <div>Land not found.</div>;

  return (
    <div>
      <h1>Land Details: **{land.title}**</h1>
      <p>ID: {land.id}</p>
      <p>Location: {land.location}</p>
      <p>Owned by User ID: **{land.ownerId}**</p>
      {/* Add more detailed land information here */}
    </div>
  );
};

export default LandDetails;