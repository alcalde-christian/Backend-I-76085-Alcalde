import { Router } from "express";

const router = Router()

const carts = []

// Listar todos los carritos
router.get("/", (req, res) => {
    res.send(carts)
})

// Listar todos los productos de un carrito
router.get("/:cid", (req, res) => {
    const cartId = parseInt(req.params.cid)
    const findById = carts.find(cart => cart.id === cartId)

    if (!findById) {
        return res.status(404).send("Carrito no encontrado")
    }

    res.send(findById.products)
})

// Generar un carrito
router.post("/", (req, res) => {
    let cart = {}

    const randomIndex = Math.floor(Math.random() * 100)
    cart.id = randomIndex
    cart.products = []

    carts.push(cart)

    res.send({status: "success", msg: "carrito generado con éxito"})
})

// Agregar un producto a un carrito determinado
router.post("/:cid/product/:pid", (req, res) => {
    const cartId = parseInt(req.params.cid)
    const productId = parseInt(req.params.pid)

    const findById = carts.find(cart => cart.id === cartId)
    const isAlreadyAdded = findById.products.find(prod => prod.id === productId)

    if (!isAlreadyAdded) {
        findById.products.push({id: productId, qty: 1})
    } else {
        isAlreadyAdded.qty ++
    }

    res.send({status: "success", msg: "producto agregado al carrito con éxito"})
})

export default router