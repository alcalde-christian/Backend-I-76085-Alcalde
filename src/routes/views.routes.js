import { Router } from "express"
import ProductManager from "../services/db/ProductManager.js";


const router = Router()
const productManager = new ProductManager()


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