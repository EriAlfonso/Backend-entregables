import cartModel from "../DAO/models/carts.model.js";
import cartsDTO from "../DTO/carts.dto.js";
import mongoose from "mongoose";
import { productRepository,ticketRepository} from "./index.js";


export default class cartService{
  constructor(cartDAO,ticketDAO,productDAO){
    this.cartDAO=cartDAO
    this.ticketDAO=ticketDAO
    this.productDAO=productDAO

  }

  async getCartByIdAndPopulate(id) {
    return this.cartDAO.getCartByIdAndPopulate(id);
}


async cartPurchase(cartId, user) {
  try {
    const cart = await this.getCartByIdAndPopulate(cartId);
    if (!cart) {
      throw new Error('Cart not found');
    }
    const remainingProducts = [];
    
    for (const cartItem of cart.products) {
      const productId = cartItem._id;
      const product = await productRepository.getProductById(productId);

      if (!product) {
        throw new Error(`Product not found for ID: ${productId}`);
      }
      const desiredQuantity = cartItem.quantity;
      
      if (product.stock >= desiredQuantity) {
        product.stock -= desiredQuantity;
        await product.save();
        remainingProducts.push(cartItem);
      } else {
        console.log(`Product ${product.title} has insufficient stock.`);
      }
      }
    const createdTicket = await ticketRepository.createTicket(cart, user );
    const newCart = await this.createCartForUser(user, remainingProducts);
    
    return { ticket: createdTicket, newCart };
  } catch (error) {
    console.error('Error during cart purchase:', error);
    throw error;
  }
}

async createCartForUser(user,remainingProducts) {
  try {
    const newCart = new cartModel({
      user: user._id,
    });
    newCart.products = remainingProducts.map(cartItem => ({
      _id: cartItem._id,
      quantity: cartItem.quantity,
    }));

    await newCart.save();

    return newCart;
  } catch (error) {
    console.error('Error creating new cart:', error);
    throw error;
  }
}
}
