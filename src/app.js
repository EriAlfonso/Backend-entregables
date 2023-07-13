import express from "express";
import cartRouter from "./routes/carts.router.js";
import { Server } from "socket.io";
import productRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js"
import handlebars from "express-handlebars"
import __dirname from './utils.js';


// import de express
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))


// set de handlebars
app.engine(`handlebars`, handlebars.engine() )
app.set('views',__dirname + '/views')
app.set('view engine', 'handlebars')

// import de routers
app.use ('/', viewsRouter)
app.use('/api/carts',cartRouter)
app.use('/api/products', productRouter)

// port con mensaje para validar que funcione
app.listen(8080, () => console.log("Server is Running.."));
