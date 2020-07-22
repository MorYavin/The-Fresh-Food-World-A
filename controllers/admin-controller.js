const express = require('express');
const router = express.Router();
const adminLogic = require('../business-logic/admin-logic');
const Product = require('../models/product-model');
const Category = require('../models/category-model');
const uuid = require('uuid');

// Update Product
router.put('/update-product', async (request, response) => {
    try {
        const oldProduct = new Product(JSON.parse(request.body.product));
        if (request.files) {
            const file = request.files.image;
            const randomName = uuid.v4();
            const extension = file.name.substr(file.name.lastIndexOf('.'));
            file.mv('../client/src/assets/images/' + randomName + extension);
            oldProduct.productImage = randomName + extension;
        }
        const updatedProduct = await adminLogic.updateProduct(oldProduct);
        if (oldProduct === null) { response.sendStatus(404); return; }
        response.json(updatedProduct);
    } catch (error) {
        response.status(500).send(error);
    }
});

// Add product
router.post('/add-product', async (request, response) => {
    try {
        if (!request.files) {
            throw "Please upload an image"
        }
        const file = request.files.image;
        const randomName = uuid.v4();
        const extension = file.name.substr(file.name.lastIndexOf('.'));
        file.mv('../client/src/assets/images/' + randomName + extension);
        const product = new Product(JSON.parse(request.body.product));
        product.productImage = randomName + extension;
        const addedProduct = await adminLogic.addProduct(product);
        response.json(addedProduct);
    } catch (error) {
        response.status(500).send(error.message);
    }
});

// Add Category
router.post('/add-category', async (request, response) => {
    try {
        const newCtegory = new Category(request.body);

        const addedCategory = await adminLogic.addCategory(newCtegory);
        response.json(addedCategory);
    } catch (error) {
        response.status(500).send(error.message);
    }
});

module.exports = router;