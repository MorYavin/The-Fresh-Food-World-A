const mongoose = require("mongoose");

const CartSchema = mongoose.Schema({
    dateCreated: String,
    status: { type: String, default: "new" },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer"
    },

},
    {
        versionKey: false,
        toJSON: { virtuals: true },
        id: false
    });

    CartSchema.virtual("itemsInCart", {
        ref: "ItemInCart",
        localField: "_id",
        foreignField: "cartId"
    });

const Cart = mongoose.model("Cart", CartSchema, "shoppingCarts");

module.exports = Cart;