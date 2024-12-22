import { Router } from "express";
import mongoose from "mongoose";
import CartManager from "../services/db/CartManager.js";
import { cartModel } from "../services/db/models/cart.model.js";

const router = Router()
const cartManager = new CartManager()


// Listar todos los carritos //////////////////////////////////////////////////
router.get("/", async (req, res) => {
    try {
        const carts = await cartManager.getAll()
        res.status(200).json({success: true, data: carts})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, error: "Error al obtener los carritos"})
    }
})


// Listar todos los productos de un carrito ///////////////////////////////////
router.get("/:cid", async (req, res) => {
    try {
        const cartId = new mongoose.Types.ObjectId(req.params.cid)
        const cart = await cartManager.getById(cartId)

        if (!cart) {
            return res.status(404).json({success: false, error: "Carrito no encontrado"})
        } else {
            res.status(200).json({success: true, data: cart.products})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, error: "Error al obtener el carrito"})
    }
})


// Generar un carrito /////////////////////////////////////////////////////////
router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.create()
        res.status(201).json({success: true, data: newCart})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, error: "Error al crear el carrito"})
    }
})


// Agregar un producto a un carrito determinado ///////////////////////////////
router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = new mongoose.Types.ObjectId(req.params.cid)
        const productId = new mongoose.Types.ObjectId(req.params.pid) 
        const addProduct = await cartManager.addProduct(cartId, productId)

        if (!addProduct.success) {
            return res.status(404).json({success: false, error: addProduct.error})
        } else {
            res.status(200).json({success: true, data: addProduct.data})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, error: "Error al agregar productos al carrito"})
    }
})


// Eliminar un producto de un carrito determinado /////////////////////////////
router.delete("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = new mongoose.Types.ObjectId(req.params.cid)
        const productId = new mongoose.Types.ObjectId(req.params.pid) 
        const removeProduct = await cartManager.removeProduct(cartId, productId)

        if (!removeProduct.success) {
            return res.status(404).json({success: false, error: removeProduct.error})
        } else {
            res.status(200).json({success: true, data: removeProduct.data})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, error: "Error al eliminar productos del carrito"})
    }
})


// Actualizar todos los productos del carrito /////////////////////////////////
router.put("/:cid", async (req, res) => {
    try {
        const cartId = new mongoose.Types.ObjectId(req.params.cid)
        const { products } = req.body

        if (products.length === 0) {
            return res.status(400).json({success: false, error: "No se han enviado productos"})
        }

        for (let product of products) {
            if (!product._id || !product.qty) {
                return res.status(400).json({success: false, error: "Los campos ID y cantidad son obligatorios"})
            }
            product._id = new mongoose.Types.ObjectId(product._id)
        }

        const updateCartProducts = await cartManager.updateProducts(cartId, products)

        if (!updateCartProducts.success) {
            return res.status(400).json({ success: false, error: updateCartProducts.error })
        } else {
            res.status(200).json({ success: true, data: updateCartProducts.data })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, error: "Error al actualizar productos del carrito"})
    }
})


// Actualizar la cantidad de un producto del carrito 
router.put("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = new mongoose.Types.ObjectId(req.params.cid)
        const productId = new mongoose.Types.ObjectId(req.params.pid)
        const updatedQty = req.body.qty

        if (!updatedQty || updatedQty <= 0) {
            return res.status(400).json({success: false, error: "Cantidad inválida"})
        }

        const updateProductQty = await cartManager.updateProductQty(cartId, productId, updatedQty)

        if (!updateProductQty.success) {
            return res.status(400).json({ success: false, error: updateProductQty.error })
        } else {
            res.status(200).json({ success: true, data: updateProductQty.data })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, error: "Error al actualizar cantidades del carrito"})

    }
})


// Vaciar el carrito //////////////////////////////////////////////////////////
router.delete("/:cid", async (req, res) => {
    try {
        const cartId = new mongoose.Types.ObjectId(req.params.cid)
        const emptyCart = await cartManager.emptyCart(cartId)

        if (!emptyCart.success) {
            return res.status(400).json({ success: false, error: emptyCart.error })
        } else {
            res.status(200).json({ success: true, data: emptyCart.data })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, error: "Error al vaciar el carrito"})
    }
})

export default router