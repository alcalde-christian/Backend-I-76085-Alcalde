// CartManager con DB
import cartModel from "./models/cart.model.js" 
import { productModel } from "./models/product.model.js"

export default class CartManager {

    // Método para obtener todos los carritos
    async getAll() {
        return await cartModel.find()
    }


    // Método para obtener sólo un carrito por ID
    async getById(id) {
        return await cartModel.findById(id)
    }


    // Método para crear un nuevo carrito vacío
    async create() {
        return await cartModel.create({ products: [] })
    }


    // Método para agregar un producto a un carrito determinado
    async addProduct(cartId, productId) {
        const cartToFind = await cartModel.findById(cartId)
        const productToAdd = await productModel.findById(productId)

        if (!cartToFind) {
            return {success: false, error: "Carrito no encontrado"}
        } 

        if (!productToAdd) {
            return {success: false, error: "Producto no encontrado"}
        }

        const isAlreadyAdded = cartToFind.products.find(prod => prod._id.equals(productId))

        if (isAlreadyAdded) {
            cartToFind.products.find(prod => prod._id.equals(productId)).qty++
        } else {
            cartToFind.products.push({_id: productId, qty: 1})
        }

        const updatedCart = await cartModel.findByIdAndUpdate(cartId, cartToFind, { new:true })

        return {success: true, data: updatedCart}
    }


    // Método para eliminar un producto de un carrito determinado
    async removeProduct(cartId, productId) {
        const cartToFind = await cartModel.findById(cartId)

        if (!cartToFind) {
            return { success: false, error: "Carrito no encontrado" }
        }

        const updatedCart = await cartModel.findByIdAndUpdate(
            cartId,
            { $pull: { products: { _id: productId } } },
            { new: true }
        ) 

        return {success: true, data: updatedCart}
    }


    // Método para actualizar todos los productos de un carrito 
    async updateProducts(cartId, products) {
        const cartToFind = await cartModel.findById(cartId)

        if (!cartToFind) {
            return {success: false, error: "Carrito no encontrado"}
        } 

        const updatedCart = await cartModel.findByIdAndUpdate(cartId, { $set: { products: products } }, { new: true })

        return {success: true, data: updatedCart}
    }


    // Método para actualizar la cantidad en un carrito determinado ///////////
    async updateProductQty(cartId, productId, newQty) {
        const cartToFind = await cartModel.findById(cartId)
        const productExists = cartToFind.products.find(prod => prod._id.equals(productId))

        if (!cartToFind) {
            return {success: false, error: "Carrito no encontrado"}
        } 

        if (!productExists) {
            return {success: false, error: "El producto elegido no existe en este carrito"}
        }

        const updatedCart = await cartModel.findOneAndUpdate(
            { _id: cartId, "products._id": productId },
            { $set: { "products.$.qty": newQty } },
            { new: true }
          )

        return {success: true, data: updatedCart}
    }


    // Método para vaciar el carrito
    async emptyCart(cartId) {
        const cartToFind = await cartModel.findById(cartId)

        if (!cartToFind) {
            return {success: false, error: "Carrito no encontrado"}
        } 

        const updatedCart = await cartModel.findByIdAndUpdate(
            cartId,
            { $set: {products: []} },
            { new: true }
        )

        return {success: true, data: updatedCart}
    }
}