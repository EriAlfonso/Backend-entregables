import { Router } from "express";
import { getForm, getProductDetail, getProducts, getProductsHome, getRealTimeProducts, indexView, postNewProduct,mockingProducts } from "../controllers/product.controller.js";
import { getChat, sendMessage } from "../controllers/chat.controller.js";
import { cartPurchase, getCarts } from "../controllers/cart.controller.js";
import { getLogin, getLogout, getPasswordMail, getPasswordReset, getProfile, getRegister,getMailReset } from "../controllers/session.controller.js";
import { authenticateToken, adminAccess, userAccess } from "../middlewares/authentication.js";
import compression from "express-compression";

const router = Router();

router.get("/", indexView);
// product routers
router.get("/home", authenticateToken, getProductsHome);
router.get("/products", authenticateToken, getProducts);
router.get("/products/:pid", authenticateToken, getProductDetail);
router.get("/realTimeProducts", authenticateToken, adminAccess, getRealTimeProducts);
router.get("/add-products", authenticateToken, adminAccess, getForm);
router.post("/add-products", authenticateToken, adminAccess, postNewProduct);
// chat routers
router.get("/chat", authenticateToken, userAccess, getChat);
router.post("/chat", authenticateToken, userAccess, sendMessage);
// cart routers
router.get("/carts", authenticateToken,userAccess, getCarts);
router.post("/carts/:cid/purchase", authenticateToken,userAccess, cartPurchase);
// session routers
router.get("/login", getLogin);
router.get("/register", getRegister);
router.get("/logout", authenticateToken, getLogout);
router.get("/profile", authenticateToken, getProfile);
router.get("/passwordReset",getPasswordReset)
router.get("/passwordMail",getPasswordMail)
router.post('/passwordResetMail',getMailReset);
// mocking router
router.get("/mockingproducts",
    compression({
        brotli: {
            enabled: true,
            zlib: {}
        }
    }), mockingProducts)

// Logger Testing
router.get("/loggerTest",(req,res)=>{
req.logger.debug('Debug log message');
req.logger.info('Info log message');
req.logger.warn('Warning log message');
req.logger.error('Error log message');
req.logger.http('HTTP log message');
res.send('Logging test complete');
})




export default router;
