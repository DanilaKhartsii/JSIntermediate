class Param {
    constructor(element){
        this.name = element.value;
        this.price = +element.dataset['price'];
        this.calories = +element.dataset['calories'];
    }
}
class Burger {
    constructor(size,add,topping){
        this.size = new Param(this._select(size));
        this.add = new Param(this._select(add));
        this.toppings = this._getToppings(topping);
    }
    _getToppings(name){
        let result = [];
        this._selectAll(name).forEach(element => {
            result.push(new Param(element))
        });
        return result;
    }
    _select(name){
        return document.querySelector(`input[name=${name}]:checked`);
    }
    _selectAll(name){
        return [...document.querySelectorAll(`input[name=${name}]:checked`)];
    }
    _sumPrice(){
        let result = this.size.price + this.add.price;
        this.toppings.forEach(function(element){
           result += element.price;
        })
        return result;
    }
    _sumCalories(){
        let result = this.size.calories + this.add.calories;
        this.toppings.forEach(function(element){
           result += element.calories;
        })
        return result;
    }
    showSum(price, calories){
        document.querySelector(price).innerHTML = this._sumPrice();
        document.querySelector(calories).innerHTML = this._sumCalories();
    }
}