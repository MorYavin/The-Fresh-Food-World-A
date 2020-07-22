const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
    productName: String,
    productPrice: Number,
    productImage: String,
    productCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    }
},
    {
        versionKey: false,
        toJSON: { virtuals: true },
        id: false
    });
    
    ProductSchema.virtual("category", {
        ref: "Category",
        localField: "productCategory",
        foreignField: "_id",
        justOne: true
    });

const Product = mongoose.model("Product", ProductSchema, "products");

module.exports = Product;