import { http } from "./https";

// Keep existing singular endpoints for backward-compat with backend
// and also support plural variants if backend expects "/categories".
const base = "/category"; // fallback
const pluralBase = "/categories";

export const getCategories = (params) => http.get(pluralBase, { params }).catch(() => http.get(base, { params }));

export const getBySlug = (slug) => http.get(`${pluralBase}/by-slug/${slug}`).catch(() => http.get(`${base}/by-slug/${slug}`));

export const getCategoryById = (id) => http.get(`${pluralBase}/${id}`).catch(() => http.get(`${base}/${id}`));

export const createCategory = (body) => http.post(`${pluralBase}/`, body).catch(() => http.post(`${base}/`, body));

export const updateCategory = (id, body) => http.put(`${pluralBase}/${id}`, body).catch(() => http.put(`${base}/${id}`, body));

export const delCategory = (id) => http.delete(`${pluralBase}/${id}`).catch(() => http.delete(`${base}/` + id));