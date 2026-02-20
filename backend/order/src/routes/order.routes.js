const express = require('express');
const createAuthMiddleware = require('../middlewares/auth.middleware');
const orderController = require('../controllers/order.controller');
const validation = require('../middlewares/validation.middleware');

const router = express.Router();

//1
router.post("/", createAuthMiddleware([ "user" ]), validation.createOrderValidations, orderController.createOrder);

//2
router.get("/me", createAuthMiddleware([ "user" ]), orderController.getMyOrders);

//4
router.post("/:id/cancel", createAuthMiddleware([ "user" ]), orderController.cancelOrderById);

// 5
router.patch("/:id/address", createAuthMiddleware([ "user" ]), validation.updateAddressValidation, orderController.updateOrderAddress);

//3
router.get("/:id", createAuthMiddleware([ "user", "admin" ]), orderController.getOrderById);


module.exports = router;