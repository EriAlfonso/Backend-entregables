import { Router } from "express";
import productManager from '../manager/productManager.js';

const router = Router()

// import de product manager para incorporar productos
const productManagerImport = new productManager('./product.json');

// routers para los views
router.get ('/', (req,res)=>{
    res.render('index', {})
})

router.get ('/home', async (req,res)=>{
    const products = await productManagerImport.getProducts();
    res.render('home', {products})
})

router.get ('/add-products', async (req,res)=>{
    res.render('form', {})
})

router.post ('/add-products', async (req,res)=>{
    const data = req.body
    const result = await productManagerImport.addProduct(data)
// 0.30
    console.log(result)
    res.redirect('/home')
})

export default router