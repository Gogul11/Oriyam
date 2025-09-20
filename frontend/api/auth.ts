import axios from "axios";

import { API_URL } from "../config/constants";

export const registerUser = async (userData: any) => {

  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData, {
      headers: { "Content-Type": "application/json" },
    });
    if(!response.data) {
      throw new Error("No data received from server");
    }
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Something went wrong");
    }
    throw new Error("Network error");
  }
};
