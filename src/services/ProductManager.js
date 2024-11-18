import fs from "fs/promises"
import path from "path"

const productsFilePath = path.resolve("src/data", "products.json")

export default class ProductManager {
    constructor() {
        this.products = []
        this.init()
    }

    // Método de inicialización de la clase
    async init() {
        try {
            const data = await fs.readFile(productsFilePath, "utf-8")
            this.products = JSON.parse(data)
        } catch (error) {
            this.products = []
        }
    }


    // Método para la persistencia de la información
    async saveToFile() {
        try {
            const jsonData = JSON.stringify(this.products, null, 2)
            await fs.writeFile(productsFilePath, jsonData) 
        } catch (error) {
            console.log(error)
            throw new Error("No se pudo guardar el archivo de productos")
        }
    }


    // Método para obtener todos los productos 
    async getAll(limit) {
        if (limit) {
            return this.products.slice(0, limit)
        } else {
            return this.products
        }
    }


    // Método para obtener sólo un producto por ID
    async getById(id) {
        return this.products.find(prod => prod.id === id)
    }


    // Método para agregar un producto 
    async add(product) {
        const newProduct = {
            id: Math.floor(Math.random() * 1000),
            ...product,
            status: true
        }

        this.products.push(newProduct)

        this.saveToFile()

        return newProduct
    }


    // Método para actualizar un producto ya existente
    async update(id, updatedFields) {
        const productIndex = this.products.findIndex(prod => prod.id === id)

        if (productIndex === -1) return null
        
        const updatedProduct = {
            ...this.products[productIndex],
            ...updatedFields,
            id: this.products[productIndex].id
        }

        this.products[productIndex] = updatedProduct

        this.saveToFile()

        return updatedProduct
    }


    // Método para eliminar un producto
    async delete(id) {
        const productIndex = this.products.findIndex(prod => prod.id === id)

        if (productIndex === -1) return null

        const deletedProduct = this.products.splice(productIndex, 1)

        this.saveToFile()

        return deletedProduct[0]
    }
}