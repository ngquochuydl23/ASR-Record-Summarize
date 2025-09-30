import { http } from "./https";

export const getSummaryVersionById = (id) => http.get("summary-versions/" + id);

export const getLastestVersionByRecord = (id) => http.get(`/summary-versions/by-record/${id}/lastest`);