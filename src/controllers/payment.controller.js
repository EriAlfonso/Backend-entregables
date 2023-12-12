import Stripe from "stripe";
import config from "../config/config.js";
import { cartRepository } from "../services/index.js";

const stripe = new Stripe(config.STRIPE_KEY)
export default class paymentController {
    async stripeSession(req, res,cartId,user,userid) {
        try {
            const cart = await cartRepository.getCartByIdAndPopulate(cartId);
            const lineItems = cart.products.map((product) => {
                return {
                    price_data: {
                        currency: 'uyu',
                        product_data: {
                            name: product._id.title,
                            description: product._id.description,
                        },
                        unit_amount: product._id.price * 100,
                    },
                    quantity: product.quantity,
                };
            });
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: lineItems,
                mode: 'payment',
                success_url: 'http://localhost:8080/api/payment/checkout-success', 
                cancel_url: 'http://localhost:8080/api/payment/checkout-cancel', 
            });
            res.status(200).json({ sessionUrl: session.url });
        } catch (error) {
            console.error('Stripe Session creation error:', error);
            req.logger.fatal('Internal Server Error',  error )
            throw error
        }
    }
    stripeSuccess(req, res) {
        console.log("ftw")
    }
    stripeCancel(req, res) {
        console.log("wtf")
    }
}
const paymentControllerimp = new paymentController();
const { stripeCancel, stripeSession, stripeSuccess } = paymentControllerimp;
export {
    stripeCancel, stripeSession, stripeSuccess
}