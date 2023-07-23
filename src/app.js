import express from "express";
import cartRouter from "./routes/carts.router.js";
import productRouter from "./routes/products.router.js";

// import de express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// import de routers
app.use("/api/carts", cartRouter);
app.use("/api/products", productRouter);

// port con mensaje para validar que funcione
app.listen(8080, () => console.log("Server is Running.."));
