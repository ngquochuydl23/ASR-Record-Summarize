import { http } from "./https";

export const findUserByPhone = (phoneNumber) => http.get("user/find-by-phone", { params: { phoneNumber } });


export const getCustomers = async () => {
    return new Promise(resolve => setTimeout(() => resolve({
        customers: [
            {
                id: 1,
                fullName: 'Hồ Thị Thu Trầm',
                email: 'hotram@gmail.com',
                phoneNumber: '0868684961'
            },
            {
                id: 2,
                fullName: 'Nguyễn Quốc Huy',
                email: 'ngquochuydl123@gmail.com',
                phoneNumber: '0868684962'
            }
        ]
    }), 2000));
}


