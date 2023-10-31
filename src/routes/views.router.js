import { Router } from "express";
import { getForm, getProductDetail, getProducts, getProductsHome, getRealTimeProducts, indexView, postNewProduct } from "../controllers/product.controller.js";
import { getChat, sendMessage } from "../controllers/chat.controller.js";
import { getCarts } from "../controllers/cart.controller.js";
import { getLogin, getLogout, getProfile, getRegister } from "../controllers/session.controller.js";
import {auth,authenticateToken} from "../middlewares/authentication.js";

const router = Router();

router.get("/", indexView);
// product routers
router.get("/home", authenticateToken, getProductsHome);
router.get("/products", authenticateToken, getProducts);
router.get("/products/:pid", authenticateToken, getProductDetail);
router.get("/realTimeProducts", authenticateToken, getRealTimeProducts);
router.get("/add-products", authenticateToken, getForm);
router.post("/add-products", authenticateToken, postNewProduct);
// chat routers
router.get("/chat", authenticateToken, getChat);
router.post("/chat", authenticateToken, sendMessage);
// cart routers
router.get("/carts", authenticateToken, getCarts);
// session routers
router.get("/login", getLogin);
router.get("/register", getRegister);
router.get("/logout", authenticateToken, getLogout);
router.get("/profile", authenticateToken, getProfile);





export default router;
