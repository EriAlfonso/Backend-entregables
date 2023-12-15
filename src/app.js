import express from "express";
import MongoStore from "connect-mongo";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import session from "express-session";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.js";
import cartRouter from "./routes/mongoRouters/carts.router.js";
import productRouter from "./routes/mongoRouters/products.router.js";
import viewsRouter from "./routes/views.router.js";
import chatRouter from "./routes/mongoRouters/chat.router.js";
import userRouter from "./routes/mongoRouters/users.router.js"
import sessionRouter from "./routes/mongoRouters/session.router.js";
import paymentRouter from "./routes/mongoRouters/payments.router.js"
import productManager from "./DAO/mongoManagers/productManagerDB.js";
import chatManager from "./DAO/mongoManagers/chatManagerDB.js";
import userModel from "./DAO/models/user.model.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import config from "./config/config.js";
import { addLogger } from "./logger/logger.js";
import { swaggerUi,swaggerSpec } from "./swagger/swaggerconfig.js";
import Handlebars from "handlebars"

// import product manager
const productManagerImport = new productManager();
const chatManagerImport = new chatManager();
// import express
const app = express();
Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('JWTCookieKey'))

// set static
app.use(express.static("./src/public"));


// set handlebars
app.engine(`handlebars`, handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(session({
  store: MongoStore.create({
    mongoUrl: config.MONGO_URL,
    dbName: config.MONGO_NAME,
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    ttl: 60 * 60 * 1000,
  }),
  secret: config.MONGO_SECRET,
  resave: true,
  saveUninitialized: true,
})
);

// set passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// badge 
app.use(async (req, res, next) => {
  if (req.session?.user) {
    
    try {
      const cartID = await userModel
        .findOne({ _id: req.session.user._id })
        .populate("cart");
        if (cartID && cartID.cart && cartID.cart.products) {
          const cartItemCount = cartID.cart.products.reduce((total, product) => total + product.quantity, 0);
          res.locals.cartItemCount = cartItemCount;
        } else {
          res.locals.cartItemCount = 0;
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        res.locals.cartItemCount = 0;
      }
    } else {
      res.locals.cartItemCount = 0;
    }
  
    next();
  });
  
// logger
app.use (addLogger)

// import  routers
app.use("/", viewsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/products", productRouter);
app.use("/api/chat", chatRouter);
app.use("/api/users", userRouter);
app.use("/api/session", sessionRouter);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/api/payment',paymentRouter)
app.use(errorHandler)

// port 
const httpServer = app.listen(config.PORT, () => console.log("Server is Running.."));

// server io
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
    const products = await productManagerImport.getProducts();

    io.emit("realtimetable", products.products);
  });
});

io.on("connection", (socket) => {
  let username;


  socket.on("setUsername", (name) => {
    username = name;
    io.emit("userJoined", username);
  });

  socket.on("saveMessage", async (data) => {
    try {
      const newMessage = await chatManagerImport.saveMessage(data.user, data.message);
      io.emit("receiveMessage", newMessage);
    } catch (error) {
      console.error("Error saving chat message:", error);
    }
  });
  socket.on("disconnect", () => {
    if (username) {
      io.emit("userLeft", username);
    }
  });
});


