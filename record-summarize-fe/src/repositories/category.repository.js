import { http } from "./https";

export const getCategories = (params) => http.get('/category', { params });

export const getBySlug = (slug) => http.get(`/category/by-slug/${slug}`);

export const getCategoryById = (id) => http.get(`/category/${id}`);

export const createCategory = (body) => http.post(`/category/`, body);

export const delCategory = (id) => http.delete('/category/' + id)