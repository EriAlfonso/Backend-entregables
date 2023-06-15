import express from "express";
import productManager from "./productManager.js";
// import de express
const app = express();
// import de product manager
const productManagerImport = new productManager("./product.json");

// get con soporte para ?limit=
app.get("/products", async (req, res) => {
    try {
        // usamos el getproducts importado
        const products = await productManagerImport.getProducts();
        // si hay limite devolvemos la lista hasta ese punto
        const limit = parseInt(req.query.limit);
        if (limit > 0) {
            const limitedProducts = products.slice(0, limit);
            res.json(limitedProducts);
            // si no hay limite mostramos toda la lista
        } else {
            res.json(products);
        }
        // error por si no encuentra el json file
    } catch (error) {
        res.json("Error Receiving Data");
    }
});

// // get con product id req.param devuelve producto especifico
app.get("/products/:pid", async (req, res) => {
    // buscamos el param.pid que le pasamos
    const productId = parseInt(req.params.pid);
    // utilizamos el getproductbyid que importamos
    try {
        const product = await productManagerImport.getProductById(productId);
        // si existe lo devolvemos como un objeto
        if (product) {
            res.json(product);
            // si no existe devolvemos un not found (heh,mi primer 404)
        } else {
            res.status(404).send("Product Not Found");
        }
        // error por si no encuentra el json file
    } catch (error) {
        res.json("Error Receiving Data");
    }
});

// port con mensaje para validar que funcione
app.listen(8080, () => console.log("Server is Running.."));
