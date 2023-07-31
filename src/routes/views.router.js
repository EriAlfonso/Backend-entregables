import { Router } from "express";
import productManager from "../DAO/mongoManagers/productManagerDB.js";

const router = Router();

// import de product manager para incorporar productos
const productManagerImport = new productManager();

// routers para los views
router.get("/", (req, res) => {
    res.render("index", {});
});

router.get("/home", async (req, res) => {
    const products = await productManagerImport.getProducts();
    const idString = products.products.map((product) => ({
        ...product,
        _id: product._id.toHexString(),
      }));
    
      res.render("home", { products: idString });
});

router.get("/realTimeProducts", async (req, res) => {
    const products = await productManagerImport.getProducts();
    const idString = products.products.map((product) => ({
        ...product,
        _id: product._id.toHexString(),
      }));
    
    res.render("realTimeProducts", {  products: idString});
});

router.get("/add-products", async (req, res) => {
    res.render("form", {});
});

router.post("/add-products", async (req, res) => {
    const { title, description, price, thumbnail, category, stock, code } =
        req.body;
    const result = await productManagerImport.addProduct(
        title,
        description,
        price,
        thumbnail,
        category,
        stock,
        code
    );
    res.redirect("/home");
});

export default router;
