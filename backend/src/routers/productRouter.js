const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// RESTful routes for products
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
