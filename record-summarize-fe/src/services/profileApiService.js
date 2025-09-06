import { http } from "./https";

export const getMyProfile = () => http.get("profile/");


//export const getUser = () => http.get("user/me");

export const updateProfile = (body) => http.put("profile/", body);

export const changeAvatar = (avatarUrl) => http.patch("profile/change-avatar", { avatar: avatarUrl });


export const getUser = () => {
    return new Promise(resolve => setTimeout(() => resolve({
        user: {
            id: '123',
            avatar: '',
            fullName: 'Hồ Thị Thu Trầm',
            email: 'hotram77@gmail.com'
        }
    }), 2000));
}