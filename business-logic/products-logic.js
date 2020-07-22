const Product = require ("../models/product-model");
const Category = require ("../models/category-model");

function getAllProducts() {
    return Product.find({}).populate("category").exec();
}

function searchProduct(productName) {
    return Product.find({productName}).exec();
} 

function getAllCategories() {
    return Category.find({}).populate("products").exec();
}
function getProductsByCategory(_id) {
    return Category.find({_id}).populate("products").exec();
}
module.exports = {
    getAllProducts,
    searchProduct,
    getProductsByCategory,
    getAllCategories
}