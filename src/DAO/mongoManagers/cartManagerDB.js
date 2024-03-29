import cartModel from "../models/carts.model.js";

export default class cartManager {
  createCart = async () => {
    try {
      const cart = {
        products: [],
      };

      return await cartModel.create(cart);;
    } catch (err) {
      throw err;
    }
  };

  getCarts = async () => {
    try {
      const carts = await cartModel.find();

      return carts;
    } catch {
      console.log("Carts not found");
      return [];
    }
  };

  getCartById = async (id) => {
    try {
      const cart = await cartModel.findById(id);
      if (cart === null) {
        throw new Error(`Cart with id: ${id} does not exist`);
      }
      return cart;
    } catch (err) {
      throw err;
    }
  };

  getCartByIdAndPopulate = async (id) => {
    try {
      const cart =
        await cartModel.findById(id)
      .populate("products._id").lean().exec();
      if (cart === null) {
        throw new Error(`Cart with id: ${id} does not exist`);
      }

      return cart;
    } catch (err) {
      throw err;
    }
  };

  updateCart = async (id, arrayProducts) => {
    try {
      const validate = await cartModel.findByIdAndUpdate(id, {
        products: arrayProducts,
      });

      if (validate === null) {
        console.log(`Cart with id: ${id} does not exist`);
        throw new Error(`Cart with id: ${id} does not exist`);
      }

      return "Cart products updated";
    } catch (err) {
      throw err;
    }
  };

  updateCartArray = async (cid) => {
    try {
      let cart = await cartModel.findById(cid);
      if (cart) {
        await cartModel.updateOne({ _id: cid }, { $set: { products: [] } });
        return { message: "Cart update success" };
      } else {
        return { message: "Cart not found" };
      }
    } catch (err) {
      throw err;
    }
  };

  removeProductFromCart = async (cartId, productId) => {
    const cart = await this.getCartById(cartId);
    const productIndex = cart.products.findIndex(
      (product) => product._id.toString() === productId
    );

    if (productIndex === -1) {
      throw new Error("Product not found in cart");
    }

    cart.products.splice(productIndex, 1);
    await this.updateCart(cartId, cart.products);
  };

  
  removeAllProductsFromCart = async (cartId) => {
    try {
      const cart = await this.getCartById(cartId);
      cart.products = [];
      await this.updateCart(cartId, cart.products);
      return "All products removed from cart";
    } catch (error) {
      throw error;
    }
  };

  deleteCart = async (id) => {
    try {
      const cartDeleted = await cartModel.findByIdAndDelete(id);

      if (cartDeleted === null) {
        console.log("Cart does not exist");
        throw new Error("Cart does not exist");
      }

      return "Cart removed successfully";
    } catch (err) {
      throw err;
    }
  };
}
