import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;;

export const requestEmailOTP = async (email: string) => {
  const res = await axios.post(`${API_URL}/forgot-password/request-otp`, { email });
  return res.data;
};

export const verifyEmailOTP = async (email: string, otp: string) => {
  const res = await axios.post(`${API_URL}/forgot-password/verify-otp`, { email, otp });
  return res.data;
};

export const resetPasswordWithEmail = async (email: string, newPassword: string) => {
  const res = await axios.post(`${API_URL}/forgot-password/reset`, { email, newPassword });
  return res.data;
};
