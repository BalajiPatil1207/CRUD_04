const Product = require('../models/productModel');
const { handle200, handle201 } = require('../helper/successHandler');
const { formatSequelizeError, handle404, handle500 } = require('../helper/errorHandler');

/**
 * Get all products
 */
const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            order: [['createdAt', 'DESC']]
        });
        return handle200(res, products, "Products fetched successfully");
    } catch (error) {
        return handle500(res, error);
    }
};

/**
 * Get single product
 */
const getProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return handle404(res, "Product not found");
        }
        return handle200(res, product, "Product fetched successfully");
    } catch (error) {
        return handle500(res, error);
    }
};

/**
 * Create product
 */
const createProduct = async (req, res) => {
    try {
        const { name, price, smallDescription } = req.body;
        const newProduct = await Product.create({
            name,
            price,
            smallDescription
        });
        return handle201(res, newProduct, "Product created successfully");
    } catch (error) {
        return formatSequelizeError(res, error);
    }
};

/**
 * Update product
 */
const updateProduct = async (req, res) => {
    try {
        const { name, price, smallDescription } = req.body;
        const product = await Product.findByPk(req.params.id);
        
        if (!product) {
            return handle404(res, "Product not found");
        }

        await product.update({
            name,
            price,
            smallDescription
        });

        return handle200(res, product, "Product updated successfully");
    } catch (error) {
        return formatSequelizeError(res, error);
    }
};

/**
 * Delete product
 */
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        
        if (!product) {
            return handle404(res, "Product not found");
        }

        await product.destroy();
        return handle200(res, null, "Product deleted successfully");
    } catch (error) {
        return handle500(res, error);
    }
};

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};
