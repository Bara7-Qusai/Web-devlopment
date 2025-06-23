export default class CartItem {
  constructor(product, quantity) {
    this.product = product;
    this.quantity = quantity;
  }

  getTotal() {
    return this.product.price * this.quantity;
  }
//filter
  matchesFilter(filterText) {
    return this.product.title.toLowerCase().includes(filterText.toLowerCase());
  }
}