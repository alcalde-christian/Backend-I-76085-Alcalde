import mongoose from "mongoose"

const productCollection = "products"

const productSchema = new mongoose.Schema({
    title: String,
})

export const productModel = mongoose.model(productCollection, productSchema)