const express = require('express');
const CATEGORY_ROUTER = express.Router();
const { categoryInput, categoryUpdateInput } = require('../type');
const { Category, Product } = require('../db/model');
const { default: mongoose } = require('mongoose');

//create a category
CATEGORY_ROUTER.post('/create', async (req, res) => {
    const body = req.body;
    const { success, error } = categoryInput.safeParse(body);
    if (!success) {
        return res.status(400).json({ message: error?.issues[0]?.message });
    }

    try {
        const category = await Category.findOne({
            name: req.body.name,
        })

        if (category) {
            return res.status(400).json({
                message: 'Category already exists',
            });
        }

        const create_category = await Category.create({
            name: req.body.name,
            description: req.body.description
        })

        await create_category.save();
        const categoryId = create_category._id
        if (categoryId) {
            return res.status(200).json({
                message: 'Category Created Successfully',
                categoryId,
            })
        }

        return res.status(400).json({
            error: 'internal-server-issue',
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

//Get all categories
CATEGORY_ROUTER.get('/', async (req, res) => {
    try {
        const categories = await Category.find({});

        if (!categories) {
            return res.status(411).json({
                error: 'internal-issue during fetch',
            });
        }

        return res.status(200).json({ "Total Categories": categories.length, categories });

    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
});

//find category by id with assocaited products
CATEGORY_ROUTER.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'invalid product id format' })
    }

    try {
        const category = await Category.findById(id);
        if (category) {
            const products = await Product.find({
                categoryId: category._id,
            })

            return res.status(200).json({ category, products });
        }
        return res.status(400).json({
            error: 'no such category exist'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
});

//update category
CATEGORY_ROUTER.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const body = req.body;

    const { success, error } = categoryUpdateInput.safeParse(body);
    if (!success) {
        return res.status(400).json({ message: error?.issues[0]?.message });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'invalid category id format' })
    }

    try {
        const category = await Category.findByIdAndUpdate(id, {
            name: req.body.name,
            description: req.body.description
        });

        if (!category) {
            return res.status(400).json({ message: 'no such category find to update' })
        }

        return res.status(200).json({
            message: 'Category updated Successfully',
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }

});

//delete category
CATEGORY_ROUTER.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'invalid category id format' })
    }

    try {
        const deleted_category = await Category.findByIdAndDelete(id)
        console.log(deleted_category);
        
        if (!deleted_category) {
            return res.status(400).json({ error: 'something-went wrong' })
        }
        await Product.updateMany({ categoryId: deleted_category._id },
            { $set: { categoryId: null } }
        );

        return res.status(200).json({ message: 'Category deleted successfully', deleted_category })

    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
});

module.exports = CATEGORY_ROUTER;