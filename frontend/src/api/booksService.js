// src/api/booksService.js
import { api } from "./api";

// CRUD de libros
export const getBooks = () => api.get("/Book");
export const createBook = (data) => api.post("/Book", data);
export const updateBook = (id, data) => api.put(`/Book/${id}`, data);
export const deleteBook = (id) => api.delete(`/Book/${id}`);

// Catálogos para selects
export const getAuthors = () => api.get("/Author");
export const getCategories = () => api.get("/Category");
