const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.get('/get-product', productController.getProduct); // Fetch all products
router.get('/getProductById/:id', productController.getProductById); // Fetch product by ID
router.post('/create-product', productController.createProduct); // Create product
router.put('/updateProductById/:id', productController.updateProduct); // Update product
router.delete('/deleteProductById/:id', productController.deleteUserById); // Delete product by ID

module.exports = router;