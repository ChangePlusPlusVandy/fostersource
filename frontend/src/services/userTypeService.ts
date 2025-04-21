import apiClient from "./apiClient";

export const fetchUserTypes = async () => {
  const res = await apiClient.get("/user-types");
  return res.data.data; // assuming the shape is { success: true, data: [...] }
};

export const createUserType = async (name: string) => {
  const res = await apiClient.post("/user-types", { name });
  return res.data;
};