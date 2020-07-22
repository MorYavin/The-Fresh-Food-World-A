const mongoose = require("mongoose");

const ItemsInCartSchema = mongoose.Schema({
    quantity: Number,
    totalCartValue: Number,
    productName:String,
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart"
    }
},
    {
        versionKey: false,
        toJSON: { virtuals: true },
        id: false
    });

    ItemsInCartSchema.virtual("products", {
        ref: "Product",
        localField: "productId",
        foreignField: "_id",
        justOne: true
    });
    

const ItemInCart = mongoose.model("ItemInCart", ItemsInCartSchema, "itemsInCart");

module.exports = ItemInCart;