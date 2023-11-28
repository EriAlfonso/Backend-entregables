export default class productDTO {
    constructor(product) {
      this.title = product.title;
      this.description = product.description;
      this.code = product.code;
      this.price = product.price;
      this.stock = product.stock;
      this.category = product.category;
      this.thumbnail = product.thumbnail;
      this.owner=product.owner,
      this.status=product?.status ?? true
    }
  }