import { Router } from "express";
import cartManager from "../../DAO/mongoManagers/cartManagerDB.js";

const router = Router();

const cartManagerImport= new cartManager()

router.post("/", async (req, res) => {
    try {
      const newCart = await cartManagerImport.createCart();
      res.status(200).json("A new cart was created");
    } catch (err) {
      res.status(400).json({ error400: "Error creating cart" });
    }
  });
  
  router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const quantity = req.body.quantity || 1;
    try {
      const cart = await cartManagerImport.getCartById(cid);
      const product = await productManager.getProductById(pid);
      const productTitle = product.title;
  
      const validate = cart.products.find((el) => el._id === pid);
  
      if (validate === undefined) {
        const newProduct = {
          _id: product._id,
          title: productTitle,
          quantity: quantity,
        };
  
        cart.products.push(newProduct);
        let newCart = cart.products;
  
        const updatedCart = await cartManagerImport.updateCart(cid, newCart);
        res.status(200).json("New product added");
      } else {
        let newCart = cart.products;
        const productPosition = cart.products.findIndex((el) => el._id === pid);
        const updatedQuantity = newCart[productPosition].quantity = quantity;
  
        console.log(updatedQuantity);
  
        const updatedProduct = {
          _id: product._id,
          title: productTitle,
          quantity: updatedQuantity
        }
  
        console.log(updatedProduct);
  
  
        const updatedCart = await cartManagerImport.updateCart(cid, newCart);
  
        console.log(updatedCart);
  
  
        res.status(200).json("Product quantity updated");
      }
    } catch (err) {
      if (err.message.includes("Cart with id")) {
        res.status(404).json({ error404: err.message });
      }
    }
  });
  
  
  router.get("/:cid", async (req, res) => {
    let { cid } = req.params;
  
    try {
      const cart = await cartManagerImport.getCartById(cid);
      res.status(200).json(cart);
    } catch (err) {
      if (err.message.includes("Cart with id")) {
        res.status(404).json({ error404: err.message });
      }
    }
  });

  export default router;
