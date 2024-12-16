import express from "express"
import handlebars  from "express-handlebars"
import mongoose from "mongoose"
import ProductManager from "./services/ProductManager.js"
import productsRoutes from './routes/products.routes.js'
import cartsRoutes from './routes/carts.routes.js'
import viewsRoutes from "./routes/views.routes.js"
import __dirname from "./utils.js"
import { Server } from "socket.io"


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
    const products = await productManager.getAll()
    io.emit("allProducts", products)

    socket.on("newProduct", data => {
        console.log("Recibido:" + JSON.stringify(data, null, 2))
        products.push(data)
        io.emit("allProducts", products)
    })

    socket.on("deletedProduct", data => {
        productManager.delete(data)
        io.emit("allProducts", products)
    })
})


// Conexión con la base de datos
const DBPATH = "mongodb+srv://alcaldechristian:an591l6r7LH1Mnro@cluster0.dgphy.mongodb.net/phonemart?retryWrites=true&w=majority&appName=Cluster0"
const connectToMongoDB = async () => {
    try {
        await mongoose.connect(DBPATH)
        console.log("Conectado a MongoDB")
    } catch (error) {
        console.log(error)
    }
}

connectToMongoDB()