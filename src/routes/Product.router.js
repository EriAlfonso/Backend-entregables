import {Router } from `express`
import productManager from "../manager/productManager";
const router = Router()

// import de product manager
const productManagerImport = new productManager("../product.json");

// PRODUCT
// get con soporte para ?limit=
app.get("/products", async (req, res) => {
    try {
        const products = await productManagerImport.getProducts();
        const limit = parseInt(req.query.limit);
        if (limit > 0) {
            const limitedProducts = products.slice(0, limit);
            res.json(limitedProducts);
        } else {
            res.json(products);
        }
    } catch (error) {
        res.json("Error Receiving Data");
    }
});

 // get con product id req.param devuelve producto especifico
app.get("/products/:pid", async (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        const product = await productManagerImport.getProductById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).send("Product Not Found");
        }
    } catch (error) {
        res.json("Error Receiving Data");
    }
});

// Post para agregar un producto


// Put para modificar un producto usando id



// Delete para borrar un producto usando id



export default router