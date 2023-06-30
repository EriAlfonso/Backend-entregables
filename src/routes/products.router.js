import { Router } from 'express';
import productManager from '../manager/productManager.js';

const router = Router();

// import de product manager
const productManagerImport = new productManager('../product.json');

// PRODUCT

// get con soporte para ?limit=
router.get('/', async (req, res) => {
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
    res.json('Error Receiving Data');
  }
});

// get con product id devuelve producto especifico
router.get('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    const product = await productManagerImport.getProductById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).send('Product Not Found');
    }
  } catch (error) {
    res.json('Error Receiving Data');
  }
});

// Post para agregar un producto
router.post('/', async (req, res) => {
  const { title, description, price, thumbnail, stock, code } = req.body;
  try {
    await productManagerImport.addProduct(title, description, price, thumbnail, stock, code);
    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Put para modificar un producto usando id
router.put('/:pid', async (req, res) => {
  const { pid } = req.params;
  const { title, description, price, thumbnail, stock, code } = req.body;

  try {
    await productManagerImport.updateProduct(pid, title, description, price, thumbnail, stock, code);
    res.json({ message: `Product with Id: ${pid} has been updated` });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete para borrar un producto usando id
router.delete('/:pid', async (req, res) => {
  const { pid } = req.params;

  try {
    await productManagerImport.deleteProduct(pid);
    res.json({ message: `Product with Id: ${pid} has been deleted` });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;