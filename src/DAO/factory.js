import config from "../config/config.js";
import mongoose from "mongoose";
import 'dotenv/config.js';

export let Products
export let Carts
export let View
export let Ticket

switch (config.persistence) {
    case "MEMORY" :
        const {default: ViewMemory } = await import("./memory/view.memory.js");
        const {default: ProductsMemory } = await import("./memory/products.memory.js");
        const {default: CartsMemory} = await import("./memory/cart.memory.js");
        Products = ProductsMemory;
        Carts = CartsMemory;
        View = ViewMemory;
        break;

    case "FILE" :
        const {default: ProductsFile } = await import("./manager/productManager.js");
        const {default: CartsFile} = await import("./manager/cartManager.js");
        const {default: TicketFile } = await import("./manager/ticketManager.js")
        Products = ProductsFile
        Carts = CartsFile
        Ticket = TicketFile
        break;

    case "MONGODB" :{
      
        const {default: ProductsMongo } = await import("./mongoManager/productManagerDB.js");
        const {default: ViewMongo } = await import("./mongoManager/viewManagerDB.js");
        const {default: CartsMongo} = await import("./mongoManager/cartManagerDB.js");
        const {default: TicketsMongo} = await import("./mongoManager/ticketManagerDB.js")
        mongoose.connect(process.env.URL_MONGO, {
            dbName: "ecommerce"
          })
            .then(() => {
              console.log("DB connected!!");
             
            })
            .catch (e => {
              console.log("can´t connect to DB", e.message);
            })
        Products = ProductsMongo
        Carts = CartsMongo
        View = ViewMongo
        Ticket = TicketsMongo
        break;
    }
}