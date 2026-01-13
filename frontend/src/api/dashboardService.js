import { api } from "./api";

export const getUsers = () => api.get("/user");
export const getBooks = () => api.get("/book");
export const getLoans = () => api.get("/loan");
