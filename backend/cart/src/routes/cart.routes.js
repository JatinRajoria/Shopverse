const express = require('express');
const createAuthMiddleware = require('../middlewares/auth.middleware')
const cartController = require('../controllers/cart.controller');
const validation = require('../middlewares/validation.middleware');

const router = express.Router();

// 3
router.get('/', createAuthMiddleware(['user']), cartController.getCart);

//1
router.post('/items',validation.validateAddItemToCart, createAuthMiddleware(['user']),cartController.addItemToCart);

// 2
router.patch('/items/:productId',validation.validateUpdateCartItem, createAuthMiddleware(['user']),cartController.updateItemQuantity);

module.exports = router;