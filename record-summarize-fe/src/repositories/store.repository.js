import { http } from "./https";

export const getStore = () => {
  return new Promise(resolve => setTimeout(() => resolve({
    store: {
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqZ2F3Qoa_dPTPu5xVSFkVh45Z0fX5keg4qQ&s',
      name: 'PG One.PC',
      userId: '1'
    }
  }), 2000));
}

export const getMyStore = () => http.get('store/myStore');

export const initStore = (body) => http.post('store', body);