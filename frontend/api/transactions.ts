import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const fetchUserTransactions = async (token: string) => {
    const response = await axios.get(`${API_URL}/transactions/buyer`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};