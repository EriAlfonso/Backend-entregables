import cartModel from "../DAO/models/carts.model.js";
import userModel from "../DAO/models/user.model.js";
import EErrors from "./errors/enums.js";
import cartsDTO from "../DTO/carts.dto.js";
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

async cartPurchase(cartId) {
  try {
    const cart = await this.getCartByIdAndPopulate(cartId);
    if (!cart) {
      const error =new Error();
                    error.name= "error getting carts",
                    error.cause= CartError(),
                    error.message= "Carts not found",
                    error.code= EErrors.CART_NOT_FOUND
                    return next(error);
    }
    const remainingProducts = [];
    
    for (const cartItem of cart.products) {
      const productId = cartItem._id;
      const product = await productRepository.getProductById(productId);

      if (!product) {
        const error =new Error();
                    error.name= "error getting products",
                    error.cause= ErrorGetProducts(productId),
                    error.message= "Product not found",
                    error.code= EErrors.PRODUCT_NOT_FOUND
                    return next(error);
      }
      const desiredQuantity = cartItem.quantity;
      
      if (product.stock < desiredQuantity) {
        remainingProducts.push(cartItem);
      } else {
        product.stock -= desiredQuantity;
        await product.save();
      }
    }
    return { remainingProducts };
  } catch (error) {
    console.error('Error during cart purchase:', error);
    throw error;
  }
}

async createCartForUser(user,remainingProducts) {
  try {
    const userWithCart = await userModel.findById(user._id).populate('cart');
    
    if (!userWithCart) {
      throw new Error('User not found');
    }

    const previousCart = userWithCart.cart;

    if (previousCart) {
      await cartModel.findByIdAndDelete(previousCart._id);
    }

    const newCart = new cartModel({
      user: user._id,
    });

    if (remainingProducts && Array.isArray(remainingProducts)) {
      newCart.products = remainingProducts.map(cartItem => ({
        _id: cartItem._id,
        quantity: cartItem.quantity,
      }));
    } else {
      console.log('No remaining products to add to the new cart.');
    }

    await newCart.save();

    return newCart;
  } catch (error) {
    console.error('Error creating new cart:', error);
    throw error;
  }
}
}
