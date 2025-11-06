import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserByIdApi, getUsersLand, getLandByIdApi } from "../api/adminApi";

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

interface Mapping {
  userId: string;
  landId: string;
}

interface Land {
  land_id: string;
  title?: string;
  location?: string;
  size?: string;
  ownerId?: string;
}

const UserDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [land, setLand] = useState<Land | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!userId) return;


        const res = await getUserByIdApi(userId);
        setUser(res.users);


        const mappings: Mapping[] = await getUsersLand();


        const mapping = mappings.find((m) => m.userId === userId);

        if (mapping) {
          const landData = await getLandByIdApi(mapping.landId);
          setLand(landData);
        }
      } catch (err) {
        console.error("Error loading user details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [userId]);

  if (loading) return <h2>Loading user details...</h2>;
  if (!user) return <h2>No user found.</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>User Details</h1>

      <h3>User Info</h3>
      <p><b>ID:</b> {user.user_id}</p>
      <p><b>Username:</b> {user.username}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Mobile:</b> {user.mobile}</p>
      <p><b>Age:</b> {user.age}</p>
      <p><b>Gov ID:</b> {user.goverment_id}</p>
      <p><b>ID Type:</b> {user.gov_id_type}</p>
      <p><b>Date of Birth:</b> {user.dateofbirth}</p>

      <hr />

      <h3>Land Info</h3>
      {!land ? (
        <p>No land assigned to this user.</p>
      ) : (
        <div>
          <p><b>Land ID:</b> {land.land_id}</p>
          <p><b>Title:</b> {land.title}</p>
          <p><b>Location:</b> {land.location}</p>
          <p><b>Size:</b> {land.size}</p>
          <p><b>Owner ID:</b> {land.ownerId}</p>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
