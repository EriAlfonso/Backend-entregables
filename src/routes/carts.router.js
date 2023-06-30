import { Router } from "express";
import cartManager from "../manager/cartManager.js";
import productManager from '../manager/productManager.js';
const router = Router();

const cartManagerImport = new cartManager('../cart.json');
const productManagerImport = new productManager('../product.json');
// CART

// Post para crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
      await cartManagerImport.createCart();
      res.status(201).json({ message: 'Cart created successfully' });
    } catch (error) {
      console.error('Error creating cart:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Get para ver lista de productos
router.get('/:cid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    
    try {
      const carts = await cartManagerImport.getCarts();
      const cart = carts.find((cart) => cart.id === cartId);
  
      if (cart) {
        res.json(cart);
      } else {
        res.status(404).send('Cart Not Found');
      }
    } catch (error) {
      console.error('Error retrieving cart:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Post para agregar productos
router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  const quantity = parseInt(req.body.quantity) || 1;

  try {
    const carts = await cartManagerImport.getCarts();
    const cartIndex = carts.findIndex((cart) => cart.id === cartId);

    if (cartIndex !== -1) {
      const cart = carts[cartIndex];

      // Check if the product ID exists in the product list
      const product = await productManagerImport.getProductById(productId);
      if (!product) {
        return res.status(404).send('Product Not Found');
      }

      const productIndex = cart.products.findIndex((product) => product.id === productId);

      if (productIndex !== -1) {
        // Product already exists in the cart, update the quantity
        cart.products[productIndex].quantity += quantity;
      } else {
        // Product does not exist in the cart, add it
        cart.products.push({ id: productId, quantity });
      }

      await cartManagerImport.updateCart(cartId, carts); // Save the updated cart to cart.json

      res.json({ message: 'Product added to cart successfully' });
    } else {
      res.status(404).send('Cart Not Found');
    }
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


export default router
