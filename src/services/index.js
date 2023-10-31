import { Products,Carts,Ticket, } from "../DAO/factory.js";
import cartService from "./cart.service.js";
import productService from "./product.service.js";
import sessionService from "./session.service.js";

export const productRepository = new productService(
    new  Products(),

  );
// export const messageRepository = new MessageRepository(new Message());
//   // user, message,ticket
// export const cartRepository = new cartService(
//     new Carts(),
//     new User(),
//     new Products(),
//     new Ticket()
//   );
// export const userRepository = new UserRepository(new User(), new Carts());
// export const sessionRepository = new sessionService(new User());
// export const ticketRepository = new TicketRepository(new Ticket());