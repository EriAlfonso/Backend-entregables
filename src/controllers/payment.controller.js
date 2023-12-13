import Stripe from "stripe";
import config from "../config/config.js";
import { cartRepository, ticketRepository } from "../services/index.js";
import nodemailer from 'nodemailer';

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
                success_url: 'http://localhost:8080/api/payment/checkout-success?cart_id={cartId}', 
                cancel_url: 'http://localhost:8080/api/payment/checkout-cancel', 
                client_reference_id:cartId,
            });
            res.status(200).json({ sessionUrl: session.url });
        } catch (error) {
            console.error('Stripe Session creation error:', error);
            req.logger.fatal('Internal Server Error',  error )
            throw error
        }
    }
    async stripeSuccess(req, res) {
        try {
            const cartId = req.query.cart_id;
            console.log(cartId)
            const userId = req.session.user
            const ticket = await ticketRepository.createTicket(cartId, userId);
            await this.sendPurchaseConfirmationEmail(ticket, userId);
            res.render('success');
        } catch (error) {
            console.error('Stripe Success error:', error);
            req.logger.error('Stripe Success error:', error);
            req.logger.fatal('Internal Server Error', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    stripeCancel(req, res) {
       
    }
    async sendPurchaseConfirmationEmail(ticket, user) {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                    port: 587,
                    auth: {
                        user: config.MAIL_USER,
                        pass: config.MAIL_PASS
                    }
            });

            const mailOptions = {
                from: config.MAIL_USER,
                to: user.email,
                subject: 'Purchase Confirmation',
                html: `<p>Thank you for your purchase. Your ticket details: ${ticket}</p>`,
            };
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending purchase confirmation email:', error);
            throw error;
        }
    }
}
const paymentControllerimp = new paymentController();
const { stripeCancel, stripeSession, stripeSuccess } = paymentControllerimp;
export {
    stripeCancel, stripeSession, stripeSuccess
}