export const getProducts = async () => {
    return new Promise(resolve => setTimeout(() => resolve({
        products: [
            {
                id: 1,
                name: 'Card màn hình ASUS TUF Gaming GeForce RTX 4090 24GB GDDR6X OG OC Edition (TUF-RTX4090-O24G-OG-GAMING)',
                thumbnail: 'https://product.hstatic.net/200000722513/product/fwebp__6__be7ded7631fb4241b3edaf400ed9c617_grande.png'
            },
            {
                id: 2,
                name: 'Card Màn Hình Asus Radeon RX 7900 XT TUF Gaming OC 20G (TUF-RX7900XT-O20G-GAMING)',
                thumbnail: 'https://product.hstatic.net/200000722513/product/5681_ea11053c19e375dcaa8138b6f531262d_7d029f536978405393da9fb3c8f1e2fa_4d3cedb8fd4a485db1ece7519c1d41a8_grande.jpg'
            }
        ]
    }), 500));

}