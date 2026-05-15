import api from "./axios";

export const applyJob = async (data) => {
  const formData = new FormData();

  formData.append("jobId", data.jobId);
  formData.append("coverLetter", data.coverLetter);
  formData.append("cvFile", data.cvFile);

  return api.post("/applications/apply", formData);
};