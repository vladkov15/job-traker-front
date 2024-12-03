import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000", 
});

export interface Job {
  _id: string;
  company: string;
  position: string;
  salary: string;
  status: string;
  note: string;
}

export const fetchJobs = async (): Promise<Job[]> => {
  const response = await api.get<Job[]>("/jobs");
  return response.data;
};

export const addJob = async (data: Omit<Job, "_id">): Promise<Job> => {
  const response = await api.post<Job>("/jobs", data);
  return response.data;
};

export const updateJob = async (id: string, data: Partial<Job>): Promise<Job> => {
  const response = await api.put<Job>(`/jobs/${id}`, data);
  return response.data;
};

export const deleteJob = async (id: string): Promise<void> => {
  await api.delete(`/jobs/${id}`);
};
