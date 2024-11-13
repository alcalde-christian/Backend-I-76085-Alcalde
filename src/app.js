import express from "express"
import productsRoutes from './routes/products.routes.js'
import cartsRoutes from './routes/carts.routes.js'

// Declaración de express y asignación de puerto.
const app = express()
const PORT = 8080

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


app.listen(PORT, () => {
    console.log(`Escuchando en el puerto: ${PORT}`)
})