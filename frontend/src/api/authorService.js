import { api } from "./http";
export const getAuthors = () => api.get("/Author");
export const getAuthorById = (id) => api.get(`/Author/${id}`);
export const createAuthor = (data) => api.post("/Author", data);
export const updateAuthor = (id, data) => api.put(`/Author/${id}`, data);
export const deleteAuthor = (id) => api.delete(`/Author/${id}`);
