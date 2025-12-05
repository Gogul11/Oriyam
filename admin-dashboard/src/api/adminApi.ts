import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

export const getUsers = async () => {
  const res = await API.get("/getUsers");
  return res.data;
};

export const getUserByIdApi = async (userId: string) => {
  const res = await API.get(`/getUser/${userId}`);
  return res.data;
};

export const getLands = async () => {
  const res = await API.get("/getLands");
  return res.data;
};

export const getLandByIdApi = async (landId: string) => {
  const res = await API.get(`/getLand/${landId}`);
  return res.data;
};

export const getUsersLand = async (userId : string) => {
  const res = await API.post("/getUsersLand", {
    userId : userId  
  });
  return res.data;
};
