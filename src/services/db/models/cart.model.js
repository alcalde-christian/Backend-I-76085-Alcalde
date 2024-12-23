import mongoose from "mongoose"

const cartCollection = "carts"

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                qty: {
                    type: Number,
                    default: 1
                }
            }
        ],
        default: []
    }
})

cartSchema.pre("find", function () {
    this.populate("products._id")
})

cartSchema.pre("findOne", function () {
    this.populate("products._id")
})

export const cartModel = mongoose.model(cartCollection, cartSchema)