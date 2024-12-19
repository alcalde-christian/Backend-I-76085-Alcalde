export default class CartManager {
    constructor() {
        this.carts = []
    }


    // Método para obtener todos los carritos
    async getAll() {
        return this.carts
    }


    // Método para obtener sólo un carrito por ID
    async getById(id) {
        return this.carts.find(cart => cart.id === id)
    }


    // Método para crear un nuevo carrito vacío
    async create() {
        const newCart = {
            id: Math.floor(Math.random() * 1000),
            products: []
        }

        this.carts.push(newCart)

        this.saveToFile()

        return newCart
    }


    // Método para agregar un producto a un carrito determinado
    async addProduct(cartId, productId) {
        const productToAdd = this.products.find(prod => prod.id === productId)
        const cartToFind = this.carts.find(cart => cart.id === cartId)

        if (!cartToFind) {
            return {success: false, error: "Carrito no encontrado"}
        } 

        if (!productToAdd) {
            return {success: false, error: "Producto no encontrado"}
        }

        const isAlreadyAdded = cartToFind.products.find(prod => prod.id === productId)

        if (isAlreadyAdded) {
            isAlreadyAdded.qty++
        } else {
            cartToFind.products.push({id: productId, qty: 1})
        }

        this.saveToFile()

        return {success: true, products: cartToFind.products}
    }
}