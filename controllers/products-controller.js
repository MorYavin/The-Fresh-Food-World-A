const express = require('express');
const router3 = express.Router();
const Product = require('../models/product-model');
const productsLogic = require('../business-logic/products-logic');

// Get all products
router3.get('/', async (request, response) => {
    try {
        const products = await productsLogic.getAllProducts();
        response.json(products);
    } catch (error) {
        response.status(500).send(error);
    }
});

// Get product by name
router3.get('/search/:productName', async (request, response) => {
    try {
        const result = await productsLogic.searchProduct(request.params.productName.toLowerCase());
        response.json(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

// Get all categories
router3.get('/categories', async (request, response) => {
    try {
        const result = await productsLogic.getAllCategories();
        response.json(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

// Get all products in Category
router3.get('/category/:_id', async (request, response) => {
    try {
        const result = await productsLogic.getProductsByCategory(request.params._id);
        response.json(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = router3;