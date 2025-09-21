import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getUserProfile = async (token: string) => {
  const response = await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};