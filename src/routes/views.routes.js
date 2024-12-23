import { Router } from "express"
import mongoose from "mongoose"
import ProductManager from "../services/db/ProductManager.js"
import CartManager from "../services/db/CartManager.js"


const router = Router()
const productManager = new ProductManager()
const cartManager = new CartManager()


// Rutas de Handlebars
router.get("/products", async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10
        const page = req.query.page ? parseInt(req.query.page) : 1
        const filter = req.query.filter ? { category: req.query.filter } : {}
        const sort = req.query.sort ? { price: req.query.sort === "asc" ? 1 : -1 } : undefined

        const products = await productManager.getAll(limit, page, filter, sort)

        console.log(products)
        
        if (limit <= 0 || page <= 0) {
            return res.status(400).json({success: false, error: "Los valores de limit y page deben ser mayores que 0"})
        }

        if (products.docs.length === 0) {
            return res.status(404).json({success: false, error: "No se encontraron productos que cumplan con el filtro solicitado"})
        }

        products.prevLink = products.hasPrevPage ? `http://localhost:8080/products?limit=${limit}&page=${products.prevPage}&filter=${req.query.filter || ``}&sort=${req.query.sort || ''}` : ''

        products.nextLink = products.hasNextPage ? `http://localhost:8080/products?limit=${limit}&page=${products.nextPage}&filter=${req.query.filter || ``}&sort=${req.query.sort || ''}` : ''

        products.isValid = !(page <= 0 || page > products.totalPages)

        res.render("index", products)
    } catch (error) {
        console.log(error)
    }
})


router.get("/cart/:cid", async (req, res) => {
    try {
        const cartId = new mongoose.Types.ObjectId(req.params.cid)
        const populatedCart = await cartManager.getById(cartId)

        if (!populatedCart) {
            return res.status(404).json({success: false, error: "Carrito no encontrado"})
        }
        
        const data = populatedCart.products.map(prod => ({
            id: prod._id._id,
            title: prod._id.title,
            price: prod._id.price,
            description: prod._id.description,
            qty: prod.qty,
        }))

        res.render("cart", { data: data })
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, error: "Error al renderizar el carrito"})
    }
})

/*
router.get("/realtimeproducts", (req, res) => {
    try {
        res.render("realTimeProducts", {})
    } catch (error) {
        console.log(error)
    }
})
*/

export default router