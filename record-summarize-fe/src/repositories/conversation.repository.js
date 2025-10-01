import { http } from "./https";
import qs from "qs";

export const getConversationsByRecordId = (recordId, params) => http.get(`conversations/by-record/${recordId}`, { params });

export const createConversation = (body) => http.post(`conversations`, body);

export const deleteItems = (ids) =>
  http.delete("conversations", {
    params: { ids },
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" })
  });