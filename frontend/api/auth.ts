import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
export const registerUser = async (userData: any) => {
  
  try {
    console.log("Registering user with data:", userData);
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


export const loginUser = async (mobile: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { mobile, password }, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("Login response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Login API error:", error.response?.data || error.message);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Something went wrong");
    }
    throw new Error("Network error");
  }
};