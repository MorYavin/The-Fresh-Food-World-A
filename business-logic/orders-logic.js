const Order = require ("../models/order-model");
const Cart = require ("../models/cart-model");
const ItemInCart = require('../models/item-in-cart-model');
const Product = require("../models/product-model");
const fs = require("fs");
const shoppingCartLogic = require('./shoppingCart-logic');

function getAllOrders(){
    return Order.find({}).exec();
}

function addNewOrder(order){
    return order.save();
}

function updateCartStatus(cart) {
    return new Promise((resolve, reject) => {
        Cart.updateOne({ _id: cart._id }, cart, (err, info) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(info.n ? cart : null);
        });
    });
}

function getOrdersByUser(_id){
    return Order.find({customerId:_id}).exec();
}

function getOrdersByOrderId(_id){
    return Order.find({_id}).exec();
}

function createReceipt(fileName, text){
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, text, err => {
            if (err) {
                reject(err);
                return;
            }
            resolve(fileName.substr(fileName.lastIndexOf('/')));
        });
    });
}


async function receiptDetails(addedOrder){
    const cartDetails = await shoppingCartLogic.getAllProductsInCart(addedOrder.cartId);
    const itemsDetails = await shoppingCartLogic.getAllProductsInCartForReceipt(addedOrder.cartId);        
    return `Recipt for order made on ${addedOrder.orderDate} for a total of ${addedOrder.totalOrderPrice} GBP\n 
    +------------------+--------------+--------------------+
    |Product           |Quantity      |Total Product Price |
    +------------------+--------------+--------------------+
    ${itemsDetails.map(item => ` ${item.productName}            `+ `    ${item.quantity}    ` +`         ${item.totalCartValue}\n   `).join('')}

    `;

}


module.exports={
    getAllOrders,
    addNewOrder,
    updateCartStatus,
    getOrdersByUser,
    createReceipt,
    receiptDetails,
    getOrdersByOrderId
}