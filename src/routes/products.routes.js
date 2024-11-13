import { Router } from "express";

const router = Router()

const products = []

// Listar todos los productos /////////////////////////////////////////////////
router.get("/", (req, res) => {
    res.send(products)
})


// Listar producto por ID (params) ////////////////////////////////////////////
router.get("/:pid", (req, res) => {
    const productId = parseInt(req.params.pid)
    const findById = products.find(prod => prod.id === productId)

    if (!findById) {
        return res.status(404).send("Producto no encontrado")
    }

    res.send(findById)
})


// Crear producto /////////////////////////////////////////////////////////////
router.post("/", (req, res) => {
    let product = req.body
    
    const randomIndex = Math.floor(Math.random() * 100)
    product.id = randomIndex
    
    if (!product.category || !product.code || !product.title || !product.description || !product.price || !product.stock || !product.status || !product.thumbnail) {
        return res.status(400).send("Alguno de los datos no ha sido completado")
    }

    products.push(product)

    res.send({status: "success", msg: "producto creado con éxito"})
})


// Actualizar producto ////////////////////////////////////////////////////////
router.put("/:pid", (req, res) => {
    const productId = parseInt(req.params.pid)
    const productIndex = products.findIndex(prod => prod.id === productId)

    if (productIndex == -1) {
        return res.status(404).send("Producto no encontrado")
    }

    const updatedProduct = req.body

    if (products[productIndex].id != updatedProduct.id) {
        return res.status(400).send("Error al ingresar ID del producto")
    }

    products[productIndex] = updatedProduct

    res.send({ status: "success", msg: "producto actualizado"})
})


// Eliminar producto //////////////////////////////////////////////////////////
router.delete("/:pid", (req, res) => {
    const productId = parseInt(req.params.pid)
    const productIndex = products.findIndex(prod => prod.id === productId)

    if (productIndex == -1) {
        return res.status(404).send("Producto no encontrado")
    }

    products.splice(productIndex, 1)

    res.send({ status: "success", msg: "producto eliminado"})
})


export default router