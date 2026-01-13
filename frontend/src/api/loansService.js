import { api } from "./api";
export const getLoans = () => api.get("/Loan");
export const getLoan = (id) => api.get(`/Loan/${id}`);
export const createLoan = (data) => api.post("/Loan", data);
export const returnLoan = (id) => api.put(`/Loan/return/${id}`);
