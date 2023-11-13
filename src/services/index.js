import { Products,Carts,Ticket, } from "../DAO/factory.js";
import cartService from "./cart.service.js";
import productService from "./product.service.js";
import sessionService from "./session.service.js";
import ticketService from "./ticket.service.js";

export const productRepository = new productService(
    new  Products(),
  );
export const sessionRepository= new sessionService(
)
export const cartRepository = new cartService(
    new Carts(),
    new Products(),
    new Ticket()
  );
export const ticketRepository = new ticketService(new Ticket());