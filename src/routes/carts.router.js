import { Router } from "express";
import cartManager from "../manager/cartManager.js";

const router = Router();

const cartManagerImport = new cartManager("../cart.json");
// CART

// Post para crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    // usamos el create cart para crear el carrito
    await cartManagerImport.createCart();
    res.status(201).json({ message: "Cart created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get para ver lista de productos segun el cart
router.get("/:cid", async (req, res) => {
  const cartId = parseInt(req.params.cid);

  try {
    // usamos el get carts para traer el json con los carts
    const carts = await cartManagerImport.getCarts();
    // buscamos el cart con el id
    const cart = carts.find((cart) => cart.id === cartId);
    // mostramos el cart
    if (cart) {
      res.json(cart);
      // un notfound por si no existe
    } else {
      res.status(404).send("Cart Not Found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  const quantity = parseInt(req.body.quantity) || 1;

  try {
    const result = await cartManagerImport.addProductCart(cartId, productId, quantity);

    if (result) {
      res.json({ message: "Product added successfully " });
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
