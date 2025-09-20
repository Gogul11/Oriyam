import axios from "axios";


export const registerUser = async (userData: any) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL
  try {
    const response = await axios.post(`${apiUrl}/auth/register`, userData, {
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
