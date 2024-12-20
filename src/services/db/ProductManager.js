// ProductManager con DB
import { productModel } from "./models/product.model.js"

export default class ProductManager {

    // Método para obtener todos los productos 
    async getAll(limit, page, filter, sort) {
        return await productModel.paginate(filter, { limit: limit, page: page, sort: sort, lean: true })
    }


    // Método para obtener sólo un producto por ID
    async getById(id) {
        return await productModel.findById(id)
    }


    // Método para agregar un producto 
    async add(product) {
        return await productModel.create(product)
    }


    // Método para actualizar un producto ya existente
    async update(id, updatedFields) {
        const updatedProduct = await productModel.findByIdAndUpdate(
            id,
            updatedFields,
            { new: true }
        )

        if (!updatedProduct) return null

        return updatedProduct
    }


    // Método para eliminar un producto
    async delete(id) {
        return await productModel.findByIdAndDelete(id)
    }
}