import { api } from "./http";

export const getCategories = () => api.get("/category");
export const createCategory = (data) => api.post("/category", data);
export const updateCategory = (id, data) => api.put(`/category/${id}`, data);
export const deleteCategory = (id) => api.delete(`/category/${id}`);
