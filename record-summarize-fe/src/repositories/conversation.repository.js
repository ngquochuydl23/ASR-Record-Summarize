import { http } from "./https";

export const getConversationsByRecordId = (recordId) => http.get(`conversations/by-record/${recordId}`);

export const createConversation = (body) => http.post(`conversations`, body);
