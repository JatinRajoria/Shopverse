const express = require('express');
const multer = require('multer');
const productController = require('../controllers/product.controller');
const createAuthMiddleware = require('../middlewares/auth.middleware');
const { createProductValidators } = require('../validators/product.validator');

const router = express.Router();

const upload = multer ({ storage: multer.memoryStorage() });

//POST /api/products
router.post('/', createAuthMiddleware(["admin", "seller"]), upload.array('images', 5), createProductValidators , productController.createProduct);

// GET /api/products
router.get('/', productController.getProducts);


//  PATCH /api/products/:id
router.patch('/:id', createAuthMiddleware(["seller"]) , productController.updateProduct);

// DELETE /api/products/:id
router.delete('/:id', createAuthMiddleware(["seller"]), productController.deleteProduct);

// GET /api/products/seller
router.get('/seller', createAuthMiddleware(["seller"]), productController.getProductsBySeller);

// isko niche isliye likha hai kyu ki agar ye upar hota to /seller ko id samajh leta aur wo route kaam nhi karta, isliye pehle specific route likha phir general route. Ye order matter karta hai express me.
// GET /api/products/:id
router.get('/:id', productController.getProductById);

module.exports = router;