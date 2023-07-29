import express from "express";
import cartRouter from "./routes/mongoRouters/carts.router.js";
import { Server } from "socket.io";
import productRouter from "./routes/mongoRouters/products.router.js";
import viewsRouter from "./routes/views.router.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import productManager from "./DAO/manager/productManager.js";
import mongoose from "mongoose";


// import product manager
const productManagerImport = new productManager("./product.json");

const mongoURL= "mongodb+srv://thecheesegw2:rR4XFxtyluPWOvpt@ecommerce.e86wvix.mongodb.net/?retryWrites=true&w=majority"

// import de express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set de static
app.use("/static", express.static("./src/public"));

// set de handlebars
app.engine(`handlebars`, handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// import de routers
app.use("/", viewsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/products", productRouter);

// port con mensaje para validar que funcione
const httpServer = app.listen(8080, () => console.log("Server is Running.."));

// conneccion a mongo 
mongoose.connect(mongoURL, {
  dbName: "ecommerce",
})
.then(() => {
  console.log("DB connected");
})
.catch((error) => {
  console.error(error);
});

// server con io
const io = new Server(httpServer);

io.on("connection", (socket) => {
  socket.on("newProduct", async (newProduct) => {
    const { title, description, price, thumbnail, category, stock, code } =
      newProduct;
    await productManagerImport.addProduct(
      title,
      description,
      price,
      thumbnail,
      category,
      stock,
      code
    );
    const products = await productManagerImport.productsFile();

    io.emit("realtimetable", products);
  });
});

// 16:56
