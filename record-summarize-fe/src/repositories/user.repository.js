import { http } from "./https";

export const login = (payload) => http.post("user/login", payload);

export const getMe = () => http.get('users/me');

export const signUp = (payload) => http.post('user/signUp', payload);