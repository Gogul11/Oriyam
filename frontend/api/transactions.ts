import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const fetchUserTransactions = async (userId: string) => {
  const url = `${API_URL}/transactions/user/${userId}`;
  console.log("Fetching transactions URL:", url);

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch user transactions");
  return await response.json();
};