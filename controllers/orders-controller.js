const express = require('express');
const router4 = express.Router();
const Order = require('../models/order-model');
const orderLogic = require('../business-logic/orders-logic');
const Cart = require("../models/cart-model");
const path = './uploads/receipts/';
const uuid = require('uuid');

// Add order
router4.post('/', async (request, response) => {
    try {
        const order = new Order(request.body);
        const date = new Date();
        order.orderDate = formatDate(date);
        const addedOrder = await orderLogic.addNewOrder(order);
        const fileName = uuid.v4();
        const receiptDetails = await orderLogic.receiptDetails(addedOrder);
        const receipt = await orderLogic.createReceipt(path + fileName + ".txt", receiptDetails);
        response.json({ order: addedOrder, file: receipt });
    } catch (error) {
        response.status(500).send(error.message);
    }
});

// Get all orders
router4.get('/all-orders', async (request, response) => {
    try {
        const orders = await orderLogic.getAllOrders();
        response.json(orders);
    } catch (error) {
        response.status(500).send(error.message);
    }
});

// Update cart
router4.put('/update-cart/:_id', async (request, response) => {
    try {
        const oldCart = new Cart(request.body);
        oldCart._id = request.params._id;
        const updatedCart = await orderLogic.updateCartStatus(oldCart);
        response.json(updatedCart);
    } catch (error) {
        response.status(500).send(error);
    }
});

// get order by Order Id
router4.get('/last-order/:_id', async (request, response) => {
    try {
        const orders = await orderLogic.getOrdersByOrderId(request.params._id);
        if (orders.length<=0) {
            response.json(null);
            return;
        } response.json(orders);
    } catch (error) {
        response.status(500).send(error.message);
    }
});
// get order by User Id
router4.get('/:_id', async (request, response) => {
    try {
        const orders = await orderLogic.getOrdersByUser(request.params._id);
        if (orders.length<=0) {
            response.json(null);
            return;
        } response.json(orders);
    } catch (error) {
        response.status(500).send(error.message);
    }
});

// Download receipt
router4.get('/receipts/:filePath', async(request,response) =>{
    try {
        const file = path + request.params.filePath;
        response.download(file,'receipt.txt');
    } catch (error) {
        response.status(500).send(error.message);
    }
});

function formatDate(date) {

    month = '' + (date.getMonth() + 1),
        day = '' + date.getDate(),
        year = date.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return date = [year, month, day].join('-');
}


module.exports = router4;