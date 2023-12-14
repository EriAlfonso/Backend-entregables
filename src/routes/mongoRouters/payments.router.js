import { Router } from "express"
import { stripeCancel,stripeSession,stripeSuccess } from "../../controllers/payment.controller.js";
import { userAccess } from "../../middlewares/authentication.js";

const router = Router();

router.post("/create-checkout-session",userAccess,stripeSession)
router.get("/checkout-success",userAccess,stripeSuccess)
router.get("/checkout-cancel",userAccess,stripeCancel)


export default router;