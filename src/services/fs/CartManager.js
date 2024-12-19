import fs from "fs/promises"
import path from "path"

const cartsFilePath = path.resolve("src/data", "carts.json")
const productsFilePath = path.resolve("src/data", "products.json")

export default class CartManager {
    constructor() {
        this.carts = []
        this.init()
    }

    // Método de inicialización de la clase
    async init() {
        try {
            const cartsData = await fs.readFile(cartsFilePath, "utf-8")
            this.carts = JSON.parse(cartsData)
            const productsData = await fs.readFile(productsFilePath, "utf-8")
            this.products = JSON.parse(productsData)
        } catch (error) {
            this.carts = []
            this.products = []
        }
    }


    // Método para la persistencia de la información
    async saveToFile() {
        try {
            const jsonData = JSON.stringify(this.carts, null, 2)
            await fs.writeFile(cartsFilePath, jsonData) 
        } catch (error) {
            console.log(error)
            throw new Error("No se pudo guardar el archivo de carritos")
        }
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