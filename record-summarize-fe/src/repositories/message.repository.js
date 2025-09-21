import { http } from "./https";

export const sendMsg = (conversationId, body) => http.post(`/conversations/${conversationId}/send-msg`, body);

export const getAllMessages = (conversationId) => http.get(`/conversations/${conversationId}/messages`);
