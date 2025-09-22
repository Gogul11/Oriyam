import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const fetchLandInterests = async (landId: string) => {
  try {
    if (!landId) throw new Error("Land ID is required");

    const url = `${API_URL}/interests/${landId}`;
    console.log("Fetching URL:", url); // 🔹 log URL

    const response = await fetch(url);
    if (!response.ok) {
      console.error("Response status:", response.status);
      throw new Error("Failed to fetch");
    }

    const data = await response.json();
    console.log("Fetched data:", data); // 🔹 log response
    return data;
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
};
