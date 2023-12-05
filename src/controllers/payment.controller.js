import Stripe from "stripe";
import config from "../config/config.js";

const stripe = Stripe(config.STRIPE_KEY)
export default class paymentController {
stripeSession(req, res) {
    
}
stripeSuccess(req, res) {
    
}
stripeCancel(req, res) {

}
}
const paymentControllerimp = new paymentController();
const { stripeCancel,stripeSession,stripeSuccess } = paymentControllerimp;
export {stripeCancel,stripeSession,stripeSuccess
}