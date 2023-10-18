export default class productDTO {
    constructor(product) {
      this.title = product.title;
      this.description = product.descripcion;
      this.code = product.code;
      this.price = product.price;
      this.status = product.status;
      this.stock = product.stock;
      this.category = product.category;
      this.thumbail = product.thumbail;
      this._id = product._id;
    }
  }