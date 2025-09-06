import { http } from "./https";

export const getRecords = () => http.get("records");

export const getRecordById = (id) => http.get(`/records/${id}`);

export const publishRecord = (id) => http.post(`/records/${id}/publish`);

export const deteleRecord = (id) => http.delete(`/records/${id}`);