const productModel = require('../models/product.model');
const mongoose = require('mongoose');
const { uploadImage } = require('../services/imagekit.service');

// Accepts multipart/form-data with fields: title, description, priceAmount, priceCurrency and images (array of files)
async function createProduct(req, res) {
    try {
        const { title, description, priceAmount, priceCurrency = 'INR' } = req.body

        if (!title || !priceAmount) {
            return res.status(400).json({
                message: "title, priceAmount and seller are required"
            });
        }
        const seller = req.user.id //extract seller from authenticated user 

        const price = {
            amount: Number(priceAmount),
            currency: priceCurrency
        };

        const images = await Promise.all((req.files || []).map(file => uploadImage({ buffer: file.buffer })));

        const product = await productModel.create({
            title,
            description,
            price,
            seller,
            images
        });
        return res.status(201).json({
            message: "product created",
            data: product,
        })

    } catch (err) {
        console.error("Create product err", err);
        return res.status(500).json({
            message: "Internal  server error on productside"
        })
    }
}

async function getProducts(req, res) {
    // req.query frontend se ata hai jab koi user apki website pr search krta hai ya filter lgata hai
    const { q, minprice, maxprice, skip=0, limit=20 } = req.query;

    const filter = {};

    if (q) {
        filter.$text = { $search: q };
    }

    if(minprice) {
        filter['price.amount'] = { ...filter['price.amount'], $gte: Number(minprice) };
    }

    if(maxprice) {
        filter['price.amount'] = { ...filter['price.amount'], $lte: Number(maxprice) };
    }

    const products = await productModel.find(filter).skip(Number(skip)).limit(Math.min(Number(limit),20)); //mtlb ek time pr apan 20 products hi bhejenge, chahe client jitna bhi maange, isse server overload nhi hoga
    return res.json({
        message: "products fetched",
        data: products,
    })

}

async function getProductById(req, res) {
      const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid product id' });
    }

    const product = await productModel.findById(id);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({
        data: product });
}

async function updateProduct(req, res) {
    const { id } = req.params;
 
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid product id' });
    }

    const product = await productModel.findOne({
            _id: id,
    });

    if (!product) {
        return res.status(404).json({ message: 'Product not found or you are not the seller' });
    }

    if (product.seller.toString() !== req.user.id) {
        return res.status(403).json({ message: 'You are not the seller of this product' });
    }

    const allowUpdates = ['title', 'description', 'price'];
    for( const key of Object.keys(req.body)) {   
        if(allowUpdates.includes(key)) {
            if (key === 'price' && typeof req.body.price === 'object') {  //puri values overwrite na ho isliye object hai toh ek ek krke update krega values
                if (req.body.price.amount !== undefined) {
                    product.price.amount = Number(req.body.price.amount);
                }
                if (req.body.price.currency !== undefined) { 
                    product.price.currency = req.body.price.currency;
                }
            } else {
                product[key] = req.body[key];
            }
        }
    }
    await product.save();

    return res.status(200).json({
        message: "product updated",
        product,
    })
}

async function deleteProduct(req, res) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid product id' });
    }

    const product = await productModel.findOne({
        _id: id,
    });

    if (!product) {
        return res.status(404).json({ message: 'Product not found or you are not the seller' });
    }

    if (product.seller.toString() !== req.user.id) {
        return res.status(403).json({ message: 'You are not the seller of this product' });
    }

    await productModel.findOneAndDelete({
        _id: id,
    });

    return res.status(200).json({
        message: "product deleted",
    })
}

async function getProductsBySeller(req, res) {
    const seller = req.user;

    const { skip=0, limit=20 } = req.query;

    const products = await productModel.find({ seller: seller.id }).skip(skip).limit(Math.min(limit, 20));

    return res.json({
        message: "products fetched",
        data: products,
    })
}

module.exports = { 
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsBySeller
};