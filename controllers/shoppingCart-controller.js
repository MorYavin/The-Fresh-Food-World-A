const express = require('express');
const router5 = express.Router();
const shoppingCartLogic = require('../business-logic/shoppingCart-logic');
const Cart = require('../models/cart-model');
const ItemInCart = require('../models/item-in-cart-model');

// Create a new cart
router5.post('/new-cart', async (request, response) => {
    try {
        const cart = new Cart();
        const date=new Date();
        cart.dateCreated = formatDate(date);
        cart.status = "active";
        cart.customerId = request.body.body;
        const newCart = await shoppingCartLogic.newCart(cart);
        response.json(newCart);
    } catch (error) {
        response.status(500).send(error);
    }
});

// Add product to cart
router5.post('/add-product-to-cart', async (request, response) => {
    try {
        const product = new ItemInCart(request.body);
        const addedProduct = await shoppingCartLogic.addProductToCart(product);
        response.json(addedProduct);
    } catch (error) {
        response.status(500).send(error);
    }
});

// Get cart by user
router5.get('/:customerId', async (request, response) => {
    try {
        const customerId = request.params.customerId;
        const cart = await shoppingCartLogic.getActiveCartByCustomer(customerId);
        response.json(cart);
    } catch (error) {
        response.status(500).send(error);
    }
});

// Get the recent active cart's creation date
router5.get('/cart-deatils/:_id', async (request, response) => {
    try {
        const cartId = request.params._id;
        const cart = await shoppingCartLogic.getActiveCartDateCreated(cartId);
        response.json(cart);
    } catch (error) {
        response.status(500).send(error);
    }
});

// Get all products in a specific cart
router5.get('/get-all-products-in-cart/:cartId', async (request, response) => {
    try {
        const cartId = request.params.cartId;
        const products = await shoppingCartLogic.getAllProductsInCart(cartId);
        response.json(products);
    } catch (error) {
        response.status(500).send(error);
    }
});

// Update specific product in the cart
router5.put('/update-product-in-cart', async (request, response) => {
    try {
        const product = new ItemInCart(request.body);
        const updatedProduct = await shoppingCartLogic.updateProductInCart(product);
        if (updatedProduct === null) {
            response.sendStatus(404);
            return;
        }
        response.json(updatedProduct);
    } catch (error) {
        response.status(500).send(error);
    }
});

// Delete product from cart
router5.delete('/delete-product-from-cart/:_id', async (request, response) => {
    try {
        const _id = request.params._id;
        await shoppingCartLogic.deleteProductFromCart(_id);
        response.sendStatus(204);
    } catch (error) {
        response.status(500).send(error);
    }
});

// Clear cart
router5.put('/clear-cart/:_id', async (request, response) => {
    try {
        const _id = request.params._id;
        await shoppingCartLogic.clearCart(_id);
        response.sendStatus(204);
    } catch (error) {
        response.status(500).send(error);
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
module.exports = router5;