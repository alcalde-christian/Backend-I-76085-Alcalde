import { Router } from "express"
import ProductManager from "../services/ProductManager.js";


const router = Router()
const productManager = new ProductManager()


// Rutas de Handlebars
router.get("/", async (req, res) => {
    try {
        const products = await productManager.getAll()
        res.render("index", {products})
    } catch (error) {
        console.log(error)
    }
})

router.get("/realtimeproducts", (req, res) => {
    try {
        res.render("realTimeProducts", {})
    } catch (error) {
        console.log(error)
    }
})

export default router