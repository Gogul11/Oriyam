// src/api/adminApi.ts

// --- Mock Data Structures ---
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Land {
  id: string;
  title: string;
  location: string;
  ownerId: string;
}

// --- Mock Data ---
const mockUsers: User[] = [
  { id: 'u1', name: 'Alice Smith', email: 'alice@example.com', role: 'admin' },
  { id: 'u2', name: 'Bob Johnson', email: 'bob@example.com', role: 'user' },
];

const mockLands: Land[] = [
  { id: 'l1', title: 'Mountain View', location: 'CA, USA', ownerId: 'u1' },
  { id: 'l2', title: 'City Loft', location: 'NY, USA', ownerId: 'u2' },
];

// --- API Functions (Simulated) ---

export const getUsers = async (): Promise<User[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockUsers;
};

export const getUserDetails = async (userId: string): Promise<User | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const user = mockUsers.find(u => u.id === userId);
  return user || null;
};

export const getLands = async (): Promise<Land[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockLands;
};

export const getLandDetails = async (landId: string): Promise<Land | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const land = mockLands.find(l => l.id === landId);
  return land || null;
};

export const getUsersLand = async (): Promise<Land[]> => {
  // Simulate getting a combined list or a specific query result
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockLands; // For simplicity, returning all lands
};