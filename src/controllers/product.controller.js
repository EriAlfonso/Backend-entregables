import { productRepository } from "../services/index.js";
import cartModel from "../DAO/models/carts.model.js";
import userModel from "../DAO/models/user.model.js";
import { faker } from "@faker-js/faker";
import EErrors from "../services/errors/enums.js";
import { ErrorGetProducts } from "../services/errors/info.js";

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
            req.logger.error("Error fetching products:", error)
            req.logger.fatal('Internal Server Error', { error: err })
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
                req.logger.error(`Product with id:${pid};not found`)
                res.status(404).json({ error404: err.message });
            } else {
                console.error("Error fetching product details:", err);
                req.logger.error("Error fetching product details:", err)
                req.logger.fatal('Internal Server Error', { error: err })
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
        if (req.session && req.session.user) {
            let owner = '';
            if (req.session.user.role === 'admin') {
                owner = 'admin';
            } else if (req.session.user.role === 'premium') {
                owner = req.session.user.email;
            } else {
                req.logger.info("No Permissions/Access granted")
                return res.status(403).send('Access Denied');
            }
            const { title, description, price, thumbnail, category, stock, code } = req.body;
            const product = { title, description, price, thumbnail, category, stock, code, owner, status: true }
            const result = await productRepository.addProduct(product);
            res.redirect("/products");
        }
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
                const error = new Error();
                error.name = "error getting products",
                    error.cause = ErrorGetProducts(),
                    error.message = "Product not found",
                    error.code = EErrors.PRODUCT_NOT_FOUND
                return next(error);
            }
            res.render("mocking", { products })
        } catch (error) {
            req.logger.error('An error occurred ' + error.message)
            return { success: false, message: "Product not found" }
        }
    }

    async deleteProduct(req, res) {
        const id = req.params.pid;
        const  user  = req.user.userData
        console.log(user)
        try {
            if (user.role !== 'admin' && user.role !== 'premium') {
                return res.status(403).json({ error: 'Unauthorized: Insufficient role access' });
            }
            const product = await productRepository.getProductById(id);
            if (!product) {
                req.logger.error(`Product with id:${id} Not found `)
                return res.status(404).json({ error: 'Product not found' });
            }
            if (user.role === 'premium' && product.owner !== user.email) {
                req.logger.error(`User:${user.first_name} Does not own the product`)
                return res.status(403).json({ error: 'Unauthorized: User does not own the product' });
            }
            const result = await productRepository.deleteProduct(id);
            if (result) {
                req.logger.info(`Product with id:${id} Deleted`)
                return res.status(200).json({ message: 'Product deleted successfully' });
            } else {
                req.logger.error("Product not found")
                return res.status(404).json({ error: 'Product not found or could not be deleted' });
            }
        } catch (error) {
            req.logger.error("error deleting product", error);
            req.logger.fatal('Internal Server Error', { error })
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

const productControllerimp = new productController();
const { deleteProduct, getProducts, getProductsHome, postNewProduct, getForm, getRealTimeProducts, getProductDetail, indexView, mockingProducts } = productControllerimp;
export {
    getForm, getProductDetail, getProductsHome, getRealTimeProducts, postNewProduct, getProducts, indexView, mockingProducts, deleteProduct
}