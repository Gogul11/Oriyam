import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserByIdApi } from "../api/adminApi";

interface User {
  user_id: string;
  username: string;
  email: string;
  mobile: string;
  age: number;
  goverment_id: string;
  gov_id_type: string;
  dateofbirth: string;
  created_at: string;
  updated_at: string;
}

const UserDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!userId) return;
        const res = await getUserByIdApi(userId);


        setUser(res.users);
      } catch (error) {
        console.error("Failed to load user details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <h2>Loading user details...</h2>;
  if (!user) return <h2>No user found.</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>User Details</h1>

      <p><b>User ID:</b> {user.user_id}</p>
      <p><b>Username:</b> {user.username}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Mobile:</b> {user.mobile}</p>
      <p><b>Age:</b> {user.age}</p>
      <p><b>Government ID:</b> {user.goverment_id}</p>
      <p><b>ID Type:</b> {user.gov_id_type}</p>
      <p><b>Date of Birth:</b> {user.dateofbirth}</p>
      <p><b>Created At:</b> {new Date(user.created_at).toLocaleString()}</p>
      <p><b>Updated At:</b> {new Date(user.updated_at).toLocaleString()}</p>
    </div>
  );
};

export default UserDetails;
