import api from "./axios";

export const getCompanies = () => api.get("/companies");
export const getCompanyDetail = (id) => api.get(`/companies/${id}`);