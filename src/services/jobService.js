import api from "./axios";

export const getJobs = () => api.get("/jobs");
export const getJobDetail = (id) => api.get(`/jobs/${id}`);
export const createJob = (data) => api.post("/jobs", data);
export const updateJob = (id, data) => api.put(`/jobs/${id}`, data);