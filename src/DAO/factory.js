import config from "../config/config.js";
import mongoose from "mongoose";

export let Products
export let Carts
export let View
export let Ticket

switch (config.PERSISTENCE) {
    case "MEMORY" :
        const {default: viewMemory } = await import("./memory/view.memory.js");
        const {default: ProductsMemory } = await import("./memory/products.memory.js");
        const {default: CartsMemory} = await import("./memory/cart.memory.js");
        Products = ProductsMemory;
        Carts = CartsMemory;
        View = viewMemory;
        break;

    case "FILE" :
        const {default: ProductsFile } = await import("./manager/productManager.js");
        const {default: CartsFile} = await import("./manager/cartManager.js");
        const {default: TicketFile } = await import("./manager/ticketManager.js");
        Products = ProductsFile
        Carts = CartsFile
        Ticket = TicketFile
        break;

    case "MONGODB" :{
      
        const {default: ProductsMongo } = await import("./mongoManagers/productManagerDB.js");
        const {default: ViewMongo } = await import("./mongoManagers/viewManagerDB.js");
        const {default: CartsMongo} = await import("./mongoManagers/cartManagerDB.js");
        const {default: TicketsMongo} = await import("./mongoManagers/ticketManagerDB.js")
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