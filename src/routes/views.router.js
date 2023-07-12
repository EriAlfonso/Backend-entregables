import { Router } from "express";
import productManager from '../manager/productManager.js';

const router = Router()

// import de product manager para incorporar productos
const productManagerImport = new productManager('./product.json');

router.get ('/', (req,res)=>{
    res.render('index', {})
})

router.get ('/home', async (req,res)=>{
    const products = await productManagerImport.getProducts();
    res.render('home', {products})
})

export default router