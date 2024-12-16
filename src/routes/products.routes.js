import { Router } from "express";
import ProductManager from "../services/ProductManager.js";

// TEMP
    import { productModel } from "../models/product.model.js"
// TEMP

const router = Router()
const productManager = new ProductManager()


// Listar todos los productos /////////////////////////////////////////////////
router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined
        const products = await productManager.getAll(limit)

        // TEMP
        const productsTemp = await productModel.find()
        console.log(productsTemp)
        // TEMP                                 ( TEMP AQUI ABAJO )

        res.status(200).json({success: true, data: productsTemp})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, error: "Error al obtener los productos"})
    }
})


// Listar producto por ID (params) ////////////////////////////////////////////
router.get("/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid)
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
            return res.status(400).send("Alguno de los datos no ha sido completado")
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
        const productId = parseInt(req.params.pid)
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
        const productId = parseInt(req.params.pid)
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