
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