import productManager from "../DAO/mongoManagers/productManagerDB.js";
import cartModel from "../DAO/models/carts.model.js";
import productDTO from "../DTO/products.dto.js";

class productService {
    constructor(productDAO, userDAO) {
        this.productDAO = productDAO;
        this.userDAO = userDAO;
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

    async addProduct(productDTO) {
        const productData = new productDTO(productDTO); 
        return this.productDAO.addProduct(productData);
    }
}

export default productService;