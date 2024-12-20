import { Router } from "express";
import ProductManager from "../services/db/ProductManager.js"
// import ProductManager from "../services/fs/ProductManager.js"

const router = Router()
const productManager = new ProductManager()


// Listar todos los productos /////////////////////////////////////////////////
router.get("/", async (req, res) => {

    // URLs de prueba con success : true
    // http://localhost:8080/api/products
    // http://localhost:8080/api/products?limit=2
    // http://localhost:8080/api/products?limit=2&page=5
    // http://localhost:8080/api/products?filter=cellphones
    // http://localhost:8080/api/products?sort=asc
    // http://localhost:8080/api/products?sort=desc

    // URLs de prueba con success : false
    // http://localhost:8080/api/products?filter=tablet
    // http://localhost:8080/api/products?limit=-1
    // http://localhost:8080/api/products?page=0

    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10
        const page = req.query.page ? parseInt(req.query.page) : 1
        const filter = req.query.filter ? { category: req.query.filter } : {}
        const sort = req.query.sort ? { price: req.query.sort === "asc" ? 1 : -1 } : undefined

        const products = await productManager.getAll(limit, page, filter, sort)
        
        if (limit <= 0 || page <= 0) {
            return res.status(400).json({success: false, error: "Los valores de limit y page deben ser mayores que 0"})
        }

        if (products.docs.length === 0) {
            return res.status(404).json({success: false, error: "No se encontraron productos que cumplan con el filtro solicitado"})
        }

        products.prevLink = products.hasPrevPage ? `http://localhost:8080/api/products?limit=${limit}&page=${products.prevPage}&filter=${req.query.filter || ``}&sort=${req.query.sort || ''}` : ''

        products.nextLink = products.hasNextPage ? `http://localhost:8080/api/products?limit=${limit}&page=${products.nextPage}&filter=${req.query.filter || ``}&sort=${req.query.sort || ''}` : ''

        res.status(200).json({success: true, data: products})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, error: "Error al obtener los productos"})
    }
})


// Listar producto por ID (params) ////////////////////////////////////////////
router.get("/:pid", async (req, res) => {
    try {
        const productId = req.params.pid
        const product = await productManager.getById(productId)

        if (!product) {
            return res.status(404).json({success: false, error: "Producto no encontrado"})
        } else {
            res.status(200).json({success: true, data: product})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, error: "Error al obtener el producto"})
    }
})


// Crear producto /////////////////////////////////////////////////////////////
router.post("/", async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnail } = req.body

        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({success: false, error: "Alguno de los datos no ha sido completado"})
        }

        if (price <= 0 || stock <= 0) {
            return res.status(400).json({ success: false, error: "Precio o stock no válidos" })
        }

        const newProduct = await productManager.add({ title, description, code, price, stock, category, thumbnail })

        res.status(201).json({success: true, data: newProduct})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, error: "Error al agregar el producto"})
    }
})


// Actualizar producto ////////////////////////////////////////////////////////
router.put("/:pid", async (req, res) => {
    try {
        const productId = req.params.pid
        const updatedProduct = await productManager.update(productId, req.body)

        if (!updatedProduct) {
            return res.status(404).json({success: false, error: "Producto no encontrado"})
        } else {
            res.status(200).json({success: true, data: updatedProduct})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, error: "Error al actualizar el producto"})
    }
})


// Eliminar producto //////////////////////////////////////////////////////////
router.delete("/:pid", async (req, res) => {
    try {
        const productId = req.params.pid
        const deletedProduct = await productManager.delete(productId)

        if (!deletedProduct) {
            return res.status(404).json({success: false, error: "Producto no encontrado"})
        } else {
            res.status(200).json({success: true, data: deletedProduct})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, error: "Error al eliminar el producto"})
    }
})


export default router