const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const app = new Vue({
    el: '#app',
    data: {
        userSearch: '',
        showCart: false,
        cartUrl: '/getBasket.json',
        catalogUrl: '/catalogData.json',
        products: [],
        cartItems: [],
        filtered: [],
        imgCatalog: 'img/placeholder.png',
        imgCart: 'img/placeholder.png',
    },
    methods: {
        getJson(url) {
            return fetch(url)
                .then(result => result.json())
                .catch(error => {
                    console.log(error);
                })
        },
        addProduct(product){
            this.getJson(`${API}/addToBasket.json`)
                .then(data => {
                    if(data.result === 1){
                        let find = this.cartItems.find(element => element.id_product === product.id_product);
                        if(find){
                            find.quantity++;
                        } else {
                            this.cartItems.push({
                                ...product,
                                quantity: 1,
                            });
                        }
                    } else {
                        alert('error');
                    }
                })
        },
        remove(item){
            this.getJson(`${API}/deleteFromBasket.json`)
                .then(data => {
                    if(data.result === 1){
                        if(item.quantity > 1){
                            item.quantity--;
                        } else {
                            this.cartItems.splice(this.cartItems.indexOf(item), 1)
                        }
                    }
                })
        },
        filter(){
            let regexp = new RegExp(this.userSearch, 'i');
            this.filtered = this.products.filter(element => regexp.test(element.product_name));
        },
    },
    mounted(){
        this.getJson(`${API + this.cartUrl}`)
            .then(data => {
                for (let element of data.contents) {
                    this.cartItems.push(element);
                }
            });
        this.getJson(`${API + this.catalogUrl}`)
            .then(data => {
                for (let element of data) {
                    this.products.push(element);
                    this.filtered.push(element);
                }
            });
    }
});