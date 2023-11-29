import { Router } from "express";
import cartManager from "../../DAO/mongoManagers/cartManagerDB.js";
import productManager from "../../DAO/mongoManagers/productManagerDB.js";
import { userAccess,authenticateToken } from "../../middlewares/authentication.js";
import mongoose from "mongoose";
import { cartPurchase } from "../../controllers/cart.controller.js";

const router = Router();

const cartManagerImport = new cartManager();
const productManagerImport = new productManager();

router.get("/:cid",authenticateToken,userAccess, async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartManagerImport.getCartByIdAndPopulate(cid)
    res.json(cart);
  } catch (error) {
    req.logger.fatal('Internal Server Error/Error fetching cart', { error: err })
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post('/:cid/purchase',authenticateToken,userAccess, cartPurchase);

router.post("/",authenticateToken,userAccess, async (req, res) => {
  try {
    const newCart = await cartManagerImport.createCart();
    res.status(200).json("A new cart was created");
  } catch (err) {
    req.logger.error('Error creating new cart');
    res.status(400).json({ error: "Error creating cart" });
  }
});

router.post("/:cid/product/:pid",authenticateToken,userAccess, async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = req.body.quantity || 1;
  try {
    const cart = await cartManagerImport.getCartById(cid);
    const product = await productManagerImport.getProductById(pid);
    const productIndex = cart.products.findIndex((el) => el._id.toString() === pid);
    if (productIndex === -1) {
      const newProduct = {
        _id: product._id,
        quantity: quantity,
      };
      cart.products.push(newProduct);
    } else {
      cart.products[productIndex].quantity += quantity;
    }
    await cartManagerImport.updateCart(cid, cart.products);
    req.logger.info('Product added to cart / quantity updated');
    res.status(200).json("Product added or quantity updated");
  } catch (err) {
    if (err.message.includes("Cart with id")) {
      req.logger.error('Error adding product: Cart or Product not found');
      res.status(404).json({ error: err.message });
    } else {
      req.logger.fatal('Internal Server Error', { error: err })
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});


router.put("/:cid",authenticateToken,userAccess, async (req, res) => {
  const { cid } = req.params;

  try {
    const result = await cartManagerImport.updateCartArray(cid);
    res.status(200).json({ message: result });
  } catch (err) {
    req.logger.fatal('Internal Server Error', { error: err })
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.put("/:cid/product/:pid",authenticateToken,userAccess, async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  if (!quantity ) {
    return res.status(400).json({ error: "Quantity must be a valid number" });
  }

  try {
    const cart = await cartManagerImport.getCartById(cid);
    const productIndex = cart.products.findIndex((product) => product._id.toString() === pid);
    if (productIndex === -1) {
      req.logger.error(`Product with ID: ${pid} ;not found `);
      res.status(404).json({ error: "Product not found in cart" });
    } else {
      cart.products[productIndex].quantity = quantity;
      await cartManagerImport.updateCart(cid, cart.products);
      req.logger.info(`Quantity Updated for product id: ${pid}`);
      res.status(200).json("Product quantity updated");
    }
  } catch (error) {
    if (error.message.includes("Cart with id")) {
      req.logger.error(`Cart with ID: ${cid} ;not found `);
      res.status(404).json({ error404: error.message });
    } else {
      req.logger.fatal('Internal Server Error', { error: err })
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

  router.delete("/:cid",authenticateToken,userAccess, async (req, res) => {
    const { cid } = req.params;
    try {
      const result = await cartManagerImport.removeAllProductsFromCart(cid);
      res.status(200).json({ message: result });
    } catch (err) {
      if (err.message.includes("Cart with id")) {
        req.logger.error(`Cart with ID: ${cid} ;not found or could not be deleted`);
        res.status(404).json({ error: err.message });
      } else {
        req.logger.fatal('Internal Server Error', { error: err })
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  });
  
  router.delete("/:cid/products/:pid",authenticateToken,userAccess, async (req, res) => {
    const { cid, pid } = req.params;
    try {
      await cartManagerImport.removeProductFromCart(cid, pid);
      const updatedCart = await cartManagerImport.getCartByIdAndPopulate(cid);
    const updatedCartItemCount = updatedCart.products.reduce((total, product) => total + product.quantity, 0);

      res.status(200).json({ message: "Product removed from cart",cartItemCount: updatedCartItemCount });
    } catch (err) {
      if (err.message.includes("Product not found in cart")) {
        req.logger.error(`Product ID: ${pid} ;not found or could not be deleted from cart`);
        res.status(404).json({ error: err.message });
      } else if (err.message.includes("Cart with id")) {
        req.logger.error(`Cart with ID: ${cid} ;not found`);
        res.status(404).json({ error: err.message });
      } else {
        req.logger.fatal('Internal Server Error', { error: err })
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  });




export default router;
