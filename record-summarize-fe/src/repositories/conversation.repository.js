import { http } from "./https";
import qs from "qs";

export const getMyConversations = (params) => http.get(`conversations`, { params });

export const getConversationsByRecordId = (recordId, params) => http.get(`conversations/by-record/${recordId}`, { params });

export const createConversation = (body) => http.post(`conversations`, body);

export const deleteItems = (ids) =>
  http.delete("conversations", {
    params: { ids },
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" })
  });

export const getConversationById = (id) => http.get(`conversations/${id}`);

export const pinConversation = (id) => http.patch(`conversations/${id}/pin`, { is_pinned: true });

export const removePinConversation = (id) => http.patch(`conversations/${id}/pin`, { is_pinned: false });

export const updateConversationTitle = (id, title) => http.patch(`conversations/${id}/title`, { title });