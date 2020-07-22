const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
    categoryName: String,
},
    {
        versionKey: false,
        toJSON: { virtuals: true },
        id: false
    });

    CategorySchema.virtual("products", {
        ref: "Product",
        localField: "_id",
        foreignField: "productCategory"
    });



const Category = mongoose.model("Category", CategorySchema, "productsCategories");

module.exports = Category;