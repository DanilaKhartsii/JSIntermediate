const products = [
    {id: 1, title: 'Notebook', price: 2000},
    {id: 2, title: 'Mouse', price: 20},
    {id: 3, title: 'Keyboard', price: 200},
    {id: 4, title: 'Gamepad', price: 50},
];
//Функция для формирования верстки каждого товара
const renderProduct = (title = 0, price = 0) => `<div class="product-item">
                <img src="img/placeholder.png" alt="placeholder">
                <div class="product-data">
                    <h3>${title}</h3>
                    <p>${price}</p>
                    <button class="buy-btn">Купить</button>
                </div>
            </div>`;
const renderPage = list => {
    document.querySelector('.products').innerHTML = list.map(item => renderProduct(item.title, item.price)).join('');
};

renderPage(products);