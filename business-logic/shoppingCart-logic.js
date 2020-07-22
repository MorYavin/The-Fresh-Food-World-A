const Cart = require('../models/cart-model');
const ItemInCart = require('../models/item-in-cart-model');
const Product = require ("../models/product-model");
function newCart(cart) {
    return cart.save();
}

function getActiveCartByCustomer(customerId){
    return Cart.find({customerId}).exec();
}
function getActiveCartDateCreated(_id){
    return Cart.find({_id}).exec();
}
function addProductToCart(product) {
    return product.save();
}

function checkIfProductExistsInCart(product) {
    return ItemInCart.findOne({ cartId: product.cartId, productId: product.productId });
}

function updateProductInCart(product) {
    return new Promise((resolve, reject) => {
        ItemInCart.updateOne({ _id: product._id }, product, (err, info) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(info.n ? product : null);
        });
    });
}

function getAllProductsInCart(cartId) {
    return Cart.find({_id:cartId}).populate({path:"itemsInCart",model:"ItemInCart",populate:{path:"products",model:"Product"}}).exec();
}
function getAllProductsInCartForReceipt(cartId) {
    return ItemInCart.find({cartId:cartId}).populate("products").exec();
}
function getAllProductsInCartByProdId(productId) {
    return Product.find({_id:productId});
}

function createCart(cart) {
    return cart.save();
}

function deleteProductFromCart(_id) {
    return ItemInCart.deleteOne({ _id });
}

function clearCart(cartId) {
    return ItemInCart.deleteMany({cartId });
}

module.exports = {
    newCart,
    getActiveCartByCustomer,
    addProductToCart,
    checkIfProductExistsInCart,
    updateProductInCart,
    getAllProductsInCart,
    deleteProductFromCart,
    clearCart,
    getAllProductsInCartForReceipt,
    getAllProductsInCartByProdId,
    createCart,
    getActiveCartDateCreated
}