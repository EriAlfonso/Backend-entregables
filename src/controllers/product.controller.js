import { productRepository } from "../services/index.js";
import cartModel from "../DAO/models/carts.model.js";
import userModel from "../DAO/models/user.model.js";
import { faker } from "@faker-js/faker";

export default class productController {
    constructor() {

    }
    async indexView(req, res) {
        res.render("index", {});
    }

    async getProductsHome(req, res) {
        const products = await productRepository.getProducts();
        const idString = products.products.map((product) => ({
            ...product,
            _id: product._id.toHexString(),
        }));
        res.render("home", { products: idString });
    }

    async getProducts(req, res) {
        const options = {
            limit: req.query.limit,
            page: parseInt(req.query.page) || 1,
            query: req.query.queryParams,
            sort: req.query.sort,
        };
        const user = req.session.user;
        try {
            const result = await productRepository.getProductsQuery(options);
            res.render("products", {
                user,
                products: result.payload,
                totalPages: result.totalPages,
                currentPage: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.prevLink,
                nextLink: result.nextLink,
                sort: options.sort,
            });
        } catch (error) {
            console.error("Error fetching products:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getProductDetail(req, res) {
        const { pid } = req.params;
        const user = req.session.user;
        try {
            const userWithCart = await userModel
                .findOne({ _id: user._id })
                .populate("cart")
                .exec();
            if (!userWithCart || !userWithCart.cart) {
                const cart = new cartModel();
                const savedCart = await cart.save();
                
                userWithCart.cart = savedCart._id;
                await userWithCart.save();
            }
            const product = await productRepository.getProductById(pid);
            res.render("productDetails", {
                title: product.title,
                description: product.description,
                price: product.price,
                thumbnail: product.thumbnail,
                stock: product.stock,
                category: product.category,
                id: product._id,
                cartID: userWithCart.cart._id.toString(),
                user,
            });
        } catch (err) {
            if (err.message.includes("Product with id")) {
                res.status(404).json({ error404: err.message });
            } else {
                console.error("Error fetching product details:", err);
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
    }

    async getRealTimeProducts(req, res) {
        const products = await productRepository.getProducts();
        const idString = products.products.map((product) => ({
            ...product,
            _id: product._id.toHexString(),
        }));
        const user = req.session.user;
        res.render("realTimeProducts", { products: idString, user });
    }

    async getForm(req, res) {
        const user = req.session.user;
        res.render("form", { user });
    }

    async postNewProduct(req, res) {
        const { title, description, price, thumbnail, category, stock, code } = req.body;

        const result = await productRepository.addProduct(title, description, price, thumbnail, category, stock, code);
        res.redirect("/home");
    }
    async mockingProducts(req, res) {
        try {
            const products = [];
    
      for (let i = 0; i < 100; i++) {
        const productName = faker.commerce.productName();
        const productPrice = faker.commerce.price();
        const productCategory = faker.lorem.word();
        const productImage = faker.image.url();
    
        const product = {
          title: productName,
          price: productPrice,
          category: productCategory,
          thumbnail: productImage,
        };
    
        products.push(product);
      }
            if (!products) {
                return CustomError.createError({
                    name: "get products  error",
                    cause: ErrorGetProducts(),
                    message: "Product not found",
                    code: EErrors.NOT_FOUND_ERROR
                  })
            }
            res.render("mocking",  {products})
        } catch (error) {
            logger.error('An error occurred ' + error.message)
            return {success: false, message: "Product not found"}
        }
      }
}

const productControllerimp = new productController();
const { getProducts, getProductsHome, postNewProduct, getForm, getRealTimeProducts, getProductDetail, indexView, mockingProducts } = productControllerimp;
export {
    getForm, getProductDetail, getProductsHome, getRealTimeProducts, postNewProduct, getProducts, indexView,mockingProducts
}