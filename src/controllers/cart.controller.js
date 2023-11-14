import cartModel from "../DAO/models/carts.model.js";
import userModel from "../DAO/models/user.model.js";
import ticketsModel from "../DAO/models/ticket.model.js";
import mongoose from "mongoose";
import { cartRepository } from "../services/index.js";


export default class cartController {

async getCarts(req, res) {
    const user = req.session.user;
    const userWithCart = await userModel
    .findOne({ _id: user._id })
    .populate("cart");
    const carts = await cartModel.find(userWithCart.cart);
    const cartID = carts ? carts[0]._id : null;
    try {
        const cart = await cartRepository.getCartByIdAndPopulate(cartID);
        cart.products.forEach(product => {
            product.totalPrice = product.quantity * product._id.price;
            product.cartId = cartID.toString()
        });
        const cartTotalPrice = cart.products.reduce((total, product) => total + product.totalPrice, 0);
        res.render("carts", { products: cart.products, cartTotalPrice, user, cartID });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async cartPurchase(req, res) {
  const cartId = req.params.cid;
  const user = req.session.user.email;
  try {
    const { remainingProducts, ticket } = await cartRepository.cartPurchase(cartId, user);
    const newCart = await cartRepository.createCartForUser(req.session.user,remainingProducts);
    console.log("ticket:",ticket)
    res.status(200).json({ message: 'Purchase completed successfully', ticket , newCart});
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
  

}
const cartControllerimp = new cartController();
const { getCarts, cartPurchase } = cartControllerimp;
export { getCarts, cartPurchase }