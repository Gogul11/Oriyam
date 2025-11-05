import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Fetch interests for a specific land
export const fetchLandInterests = async (landId: string) => {
  try {
    if (!landId) throw new Error("Land ID is required");

    const url = `${API_URL}/interests/${landId}`;
    console.log("Fetching land interests URL:", url);

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch land interests");

    const data = await response.json();
    console.log("Fetched land interests:", data);
    return data;
  } catch (err) {
    console.error("Fetch land interests error:", err);
    throw err;
  }
};

// Fetch all interests made by a specific user (no token needed)
export const fetchUserInterests = async (userId: string) => {
  try {
    if (!userId) throw new Error("User ID is required");

    const url = `${API_URL}/interests/user/${userId}`;
    console.log("Fetching user interests URL:", url);

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch user interests");

    const data = await response.json();
    console.log("Fetched user interests:", data);
    return data;
  } catch (err) {
    console.error("Fetch user interests error:", err);
    throw err;
  }
};
