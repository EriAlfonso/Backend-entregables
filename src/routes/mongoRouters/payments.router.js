import { Router } from "express"
import { stripeCancel,stripeSession,stripeSuccess } from "../../controllers/payment.controller.js";

const router = Router();

router.get("/create-checkout-session",stripeSession)
router.get("/checkout-success",stripeSuccess)
router.get("/checkout-cancel",stripeCancel)


export default router;