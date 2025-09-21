import axios from "axios";

export const getLandInterests = async (landId: string) => {
  const res = await axios.get(`https://your-api.com/lands/${landId}/interests`);
  return res.data; // array of { userId, username, email, mobile }
};