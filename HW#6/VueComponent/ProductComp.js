Vue.component('products', {
	data() {
		return {
			catalogUrl: "/catalogData.json",
			products: [],
			filtered: [],
			imgCatalog: "img/placeholder.png",
		};
    },
    methods: {
        filter(value){
            let regexp = new RegExp(value, 'i');
            this.filtered = this.products.filter(element => regexp.test(element.product_name));
        },
    },
    mounted(){
        this.$parent.getJson(`${API + this.catalogUrl}`)
            .then(data => {
                for (let element of data) {
                    this.products.push(element);
                    this.filtered.push(element);
                }
            });
    },
    template: `
        <div class="products">
            <product ref="refref" v-for="item of filtered" :key="item.id_product" :img="imgCatalog" :product="item"></product>
        </div>`
});

Vue.component('product', {
    props: ['product', 'img'],
    data(){
        return {
            cartAPI: this.$root.$refs.cart,
        };
    },
    template: `
            <div class="product-item">
                        <img :src="img" alt="Some img">
                        <div class="product-data">
                            <h3>{{product.product_name}}</h3>
                            <p>{{product.price}}₽</p>
                            <button class="buy-btn" @click="cartAPI.addProduct(product)">Купить</button>
        <!-- 1                    <button class="buy-btn" @click="$root.$refs.cart.addProduct(product)">Купить</button>-->
        <!-- 2                    <button class="buy-btn" @click="$parent.$parent.$refs.cart.addProduct(product)">Купить</button>-->
                        </div>
                    </div>`
});
