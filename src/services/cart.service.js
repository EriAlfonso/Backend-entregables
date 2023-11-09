import cartModel from "../DAO/models/carts.model.js";
import cartsDTO from "../DTO/carts.dto.js";
import cartManager from "../DAO/mongoManagers/cartManagerDB.js";
export default class cartService{
  constructor(cartDAO){
    this.cartDAO=cartDAO

  }
  async cartPurchase (cartId){
    const cart = await cartModel.findById(cartId).populate('products.product');
    if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
    }
    for (const cartItem of cart.products) {
        const product = cartItem.product;
        const desiredQuantity = cartItem.quantity;
        if (product.stock >= desiredQuantity) {
            product.stock -= desiredQuantity;
            await product.save();
        } else {
            cartItem.quantity = product.stock;
        }
    }
    const ticket = new TicketModel({
      cart: cart._id,
      products: cart.products,
  });
  await ticket.save()
    return ticket;
}}
