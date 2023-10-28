import productManager from "../DAO/mongoManagers/productManagerDB.js";
import cartModel from "../DAO/models/carts.model.js";
import productDTO from "../DTO/products.dto.js";

export default class productService {
    constructor(productDAO, userDAO) {
        this.productDAO = productDAO;
    }

    async getProducts() {
        return this.productDAO.getProducts();
    }

    async getProductsQuery(options) {
        return this.productDAO.getProductsQuery(options);
    }

    async getProductById(pid) {
        return this.productDAO.getProductById(pid);
    }

    async addProduct(product) {
        const productData = new productDTO(product); 
        return this.productDAO.addProduct(productData);
    }
}
