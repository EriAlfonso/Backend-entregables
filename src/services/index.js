import { Products,Carts,Ticket,User } from "../DAO/factory.js";
import cartService from "./cart.service.js";
import productService from "./product.service.js";
import sessionService from "./session.service.js";

export const productRepository = new productService(
    new Products(),
    new User()
  );
export const messageRepository = new MessageRepository(new Message());
  // user, message,ticket
export const cartRepository = new cartService(
    new Carts(),
    new User(),
    new Products(),
    new Ticket()
  );
export const userRepository = new UserRepository(new User(), new Cart());
export const sessionRepository = new sessionService(new User());
export const ticketRepository = new TicketRepository(new Ticket());