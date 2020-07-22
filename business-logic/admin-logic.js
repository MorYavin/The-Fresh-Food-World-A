const Product = require('../models/product-model');
const Category = require('../models/category-model');
  
function addProduct(product) {
        return product.save();
    }

function updateProduct(product) {
    return new Promise((resolve, reject) => {
        Product.updateOne({ _id: product._id }, product, (err, info) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(info.n ? product : null);
        });
    });
}

function addCategory(category) {
    return category.save();
}

module.exports = {
    updateProduct,
    addProduct,
    addCategory
}