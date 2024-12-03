import express from "express"
import handlebars  from "express-handlebars"
import productsRoutes from './routes/products.routes.js'
import cartsRoutes from './routes/carts.routes.js'
import viewsRoutes from "./routes/views.routes.js"
import __dirname from "./utils.js"
import { Server } from "socket.io"
import ProductManager from "./services/ProductManager.js"


// Declaración de express y asignación de puerto.
const app = express()
const PORT = 8080
const httpServer = app.listen(PORT, () => console.log(`Escuchando en el puerto: ${PORT}`))


// Configuración de socket
const io = new Server(httpServer)


// Configuración de la carpeta "public"
app.use(express.static(__dirname + "/public"));


// Configuración de Handlebars
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")


// Middlewares de configuración
app.use(express.json())
app.use(express.urlencoded({extended:true}))


// Endpoint de telemetría
app.get("/ping", (req, res) => {
    res.send("pong")
})


// Routes
app.use("/api/products", productsRoutes)
app.use("/api/carts", cartsRoutes)
app.use("/", viewsRoutes)

const productManager = new ProductManager()

// Canal de comunicación mediante sockets
io.on("connection", async socket => {
    io.emit("allProducts", await productManager.getAll())

    socket.on("newProduct", async data => {
        console.log("Recibido:" + JSON.stringify(data, null, 2))
        
        io.emit("allProducts", await productManager.getAll())
        console.log(productManager.getAll())
    })
})
