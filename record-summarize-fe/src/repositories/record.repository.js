import { http } from "./https";

export const getRecords = (params) =>  http.get("records", { params });

export const getRecordById = (id) => http.get(`/records/${id}`);

export const updateRecordById = (id, body) => http.put(`/records/${id}`, body);

export const publishLastVRecord = (id) => http.post(`/records/${id}/publish/last`);

export const deteleRecord = (id) => http.delete(`/records/${id}`);

export const genSuggest = (prompt) => http.post(`/records/helper/generate-form`, { prompt });

export const createRecord = (body) => http.post('/records', body);

export const retryChatbot = (id) => http.post(`/records/${id}/retry-chatbot`);


