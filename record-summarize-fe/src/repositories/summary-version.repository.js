import { http } from "./https";

export const getSummaryVersionById = (id) => http.get("summary-versions/" + id);