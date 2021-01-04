const API =	"https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

class List {
	constructor(url, container, list = listContext) {
		this.container = container;
		this.list = list;
		this.url = url;
		this.goods = [];
		this.allProducts = [];
		this._init();
	}
	getJson(url) {
		return fetch(url ? url : `${API + this.url}`)
			.then((result) => result.json())
			.catch((error) => {
				console.log(error);
			});
	}
	handleData(data) {
		this.goods = [...data];
		this.render();
	}
	calcSum() {
		return this.allProducts.reduce((sum, item) => (sum += item.price), 0);
	}
	render() {
		const block = document.querySelector(this.container);
		for (let product of this.goods) {
			//console.log(this.constructor.name);
			const productObj = new this.list[this.constructor.name](product);
			// if(this.constructor.name === 'ProductList'){
			//     const productObj = new ProductItem(product);
			// }
			// if(this.constructor.name === 'Cart'){
			//     const productObj = new CartItem(product);
			// }
			this.allProducts.push(productObj);
			block.insertAdjacentHTML("beforeend", productObj.render());
		}
	}
	_init() {
		return false;
	}
}

class Item {
	constructor(element, img = "img/placeholder.png") {
		this.product_name = element.product_name;
		this.price = element.price;
		this.id_product = element.id_product;
		this.img = img;
	}
	render() {
		return ``;
	}
}

class ProductsList extends List {
	constructor(cart, container = ".products", url = "/catalogData.json") {
		super(url, container);
		this.cart = cart;
		this.getJson().then((data) => this.handleData(data));
	}
	_init() {
		document.querySelector(this.container).addEventListener("click", (element) => {
				if (element.target.classList.contains("buy-btn")) {
					this.cart.addProduct(element.target);
				}
			});
	}
}

class ProductItem extends Item {
	render() {
		return `<div class="product-item" data-id="${this.id_product}">
                <img src="${this.img}" alt="Some img">
                <div class="product-data">
                    <h3>${this.product_name}</h3>
                    <p>$${this.price}</p>
                    <button class="buy-btn"
                    data-id="${this.id_product}"
                    data-name="${this.product_name}"
                    data-price="${this.price}">Купить</button>
                </div>
            </div>`;
	}
}

class Cart extends List {
	constructor(container = ".cart-block", url = "/getBasket.json") {
		super(url, container);
		this.getJson().then((data) => {
            this.handleData(data.contents);
		});
	}
	addProduct(element) {
		this.getJson(`${API}/addToBasket.json`).then((data) => {
			if (data.result === 1) {
				let productId = +element.dataset["id"];
				let find = this.allProducts.find((product) => product.id_product === productId);
				if (find) {
					find.quantity++;
					this._updateCart(find);
				} else {
					let product = {
						id_product: productId,
						price: +element.dataset["price"],
						product_name: element.dataset["name"],
						quantity: 1,
					};
					this.goods = [product];
					this.render();
				}
			} else {
				alert("Error!");
			}
		});
	}
	removeProduct(element) {
		this.getJson(`${API}/deleteFromBasket.json`).then((data) => {
			if (data.result === 1) {
				let productId = +element.dataset["id"];
				let find = this.allProducts.find((product) => product.id_product === productId);
				if (find.quantity > 1) {
					find.quantity--;
					this._updateCart(find);
				} else {
					this.allProducts.splice(this.allProducts.indexOf(find), 1);
					document.querySelector(`.cart-item[data-id="${productId}"]`).remove();
				}
			} else {
				alert("Error!");
			}
		});
	}
	_updateCart(product) {
		let block = document.querySelector(`.cart-item[data-id="${product.id_product}"]`);
		block.querySelector(".product-quantity").textContent = `Quantity: ${product.quantity}`;
		block.querySelector(".product-price").textContent = `$${product.quantity * product.price}`;
	}
	_init() {
		document.querySelector(".btn-cart").addEventListener("click", () => {
			document.querySelector(this.container).classList.toggle("invisible");
		});
		document
			.querySelector(this.container).addEventListener("click", (element) => {
				if (element.target.classList.contains("del-btn")) {
					this.removeProduct(element.target);
				}
			});
	}
}

class CartItem extends Item {
	constructor(element, img = "img/placeholder.png") {
		super(element, img);
		this.quantity = element.quantity;
	}
	render() {
		return `<div class="cart-item" data-id="${this.id_product}">
                    <div class="product-bio">
                        <img src="${this.img}" alt="Some image">
                        <div class="product-data">
                            <p class="product-title">${this.product_name}</p>
                            <p class="product-quantity">Quantity: ${this.quantity}</p>
                            <p class="product-single-price">$${this.price}</p>
                        </div>
                    </div>
                    <div class="right-block">
                        <p class="product-price">$${this.quantity * this.price}</p>
                        <button class="del-btn" data-id="${this.id_product}">&times;</button>
                    </div>
                </div>`;
	}
}

const listContext = {
    ProductsList: ProductItem,
    Cart: CartItem
}

let cart = new Cart();
let products = new ProductsList(cart);
