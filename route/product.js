const express = require('express');
const PRODUCT_ROUTER = express.Router();
const { productInput, productUpdateInput } = require('../type');
const { Product, Category } = require('../db/model');
const { default: mongoose } = require('mongoose')

//create a product
PRODUCT_ROUTER.post('/create', async (req, res) => {
    const body = req.body;
    console.log(body);

    const { success, error } = productInput.safeParse(body);
    if (!success) {
        return res.status(400).json({ message: error?.issues[0]?.message });
    }

    try {
        const product = await Product.findOne({
            name: req.body.name,
        })

        if (product) {
            return res.status(400).json({
                message: 'Product already exists',
            });
        }

        const create_product = await Product.create(body)

        await create_product.save();
        const productId = create_product._id
        if (productId) {
            return res.status(200).json({
                message: 'Product Created Successfully',
                productId,
            })
        }

        return res.status(400).json({
            error: 'internal-server-issue',
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json(error.message);
    }
});

//get all products
PRODUCT_ROUTER.get('/', async (req, res) => {
    try {
        const products = await Product.find().lean();
        const categories = await Category.find().lean();

        if (!products && !categories) {
            return res.status(411).json({
                error: 'internal-issue during fetch',
            });
        }

        const filterProductByCategory = products.map((item) => {
            const category = categories.find((c) => c._id === item.categoryId?.toString());
            return {
                    ...item,
                    categoryName: category ? category.name : "uncategorized",
            }
        })

        return res.status(200).json({
            "totalProducts": products.length,
            filterProductByCategory
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
})

//find product by id with category
PRODUCT_ROUTER.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'invalid product id format' })
    }

    try {
        const product = await Product.findById(id).populate('categoryId');
        if (!product) {
            return res.status(400).json({
                error: 'no such product exist'
            });
        }
        return res.status(200).json(product);

    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
});

//update product
PRODUCT_ROUTER.patch('/update/:id', async (req, res) => {
    const { id } = req.params;
    const body = req.body;

    const { success, error } = productUpdateInput.safeParse(body);
    if (!success) {
        return res.status(400).json({ message: error?.issues[0]?.message });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'invalid category id format' })
    }

    try {
        const product = await Product.findByIdAndUpdate(id, {
            name: req.body.name,
            price: req.body.price,
            stock: req.body.stock,
        });

        if (!product) {
            return res.status(400).json({ message: 'no such product find to update' })
        }

        return res.status(200).json({
            message: 'Product updated Successfully',
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }

});

//delete category
PRODUCT_ROUTER.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'invalid category id format' })
    }

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(400).json({ error: 'something-went wrong' })
        }

        return res.status(200).json({ message: 'Product deleted successfully', deletedProduct })

    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
});

module.exports = PRODUCT_ROUTER;