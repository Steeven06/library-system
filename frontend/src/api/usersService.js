import { api } from "./http";

export const getUsers = () => api.get("/User");
export const getUserById = (id) => api.get(`/User/${id}`);
export const createUser = (data) => api.post("/User", data);
export const updateUser = (id, data) => api.put(`/User/${id}`, data);
export const deleteUser = (id) => api.delete(`/User/${id}`);
