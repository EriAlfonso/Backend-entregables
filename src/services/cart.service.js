import cartModel from "../DAO/models/carts.model.js";
import ticketModel from "../DAO/models/ticket.model.js";
import cartsDTO from "../DTO/carts.dto.js";
import cartManager from "../DAO/mongoManagers/cartManagerDB.js";
export default class cartService{
  constructor(cartDAO){
    this.cartDAO=cartDAO

  }
  async cartTicket(cartId, user) {
    try {
      const cart = await cartModel.findById(cartId).populate('products._id');
  
      if (!cart) {
        throw new Error('Cart not found');
      }
  
      for (const cartItem of cart.products) {
        const product = cartItem._id;
        const desiredQuantity = cartItem.quantity;
  
        if (product.stock >= desiredQuantity) {
          product.stock -= desiredQuantity;
          await product.save();
        } else {
          cartItem.quantity = product.stock;
        }
      }
      
      const cartTotalPrice = cart.products.reduce((total, product) => total + product.totalPrice, 0);
      console.log(cartTotalPrice)
      const tickets = await ticketModel.find();
      const nextCode = tickets.length + 1;
  
      const ticket = new ticketModel({
        cart: cart._id,
        purchase_datetime: new Date().toString(),
        products: cart.products,
        purchaser: user,
        amount: cartTotalPrice,
        code: nextCode,
      });
  
      await ticket.save();
      return ticket;
    } catch (error) {
      console.error('Error during cart purchase:', error);
      throw error;
    }
  }
}
