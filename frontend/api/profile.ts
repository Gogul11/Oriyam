import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Fetch user profile
export const getUserProfile = async (token: string) => {
  const response = await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update user profile
export const updateUserProfile = async (token: string, formData: {
  username: string;
  email: string;
  mobile: string;
  age: string;
  dateofbirth: string;
}) => {
  const response = await axios.put(`${API_URL}/profile`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};