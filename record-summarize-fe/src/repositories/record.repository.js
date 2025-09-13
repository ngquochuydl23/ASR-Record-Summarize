import { http } from "./https";

export const getRecords = () => http.get("records");

export const getRecordById = (id) => http.get(`/records/${id}`);

export const publishLastVRecord = (id) => http.post(`/records/${id}/publish/last`);

export const deteleRecord = (id) => http.delete(`/records/${id}`);

export const genSuggest = (prompt) => http.post(`/records/helper/generate-form`, { prompt });

export const createRecord = (body) => http.post('/records', body);


