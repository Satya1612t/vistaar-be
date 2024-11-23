const zod = require('zod');

const categoryInput = zod.object({
    name: zod.string().min(1, "Name is required"),
    description: zod.string(),
});

const categoryUpdateInput = zod.object({
    name: zod.string().min(1, "Name is required"),
    description: zod.string().optional(),
});

const productInput = zod.object({
    name: zod.string().min(1, "Name is required"),
    price: zod.number().positive("Price must be positive"),
    stock: zod.number().positive("Stock must be positive").default(0),
    categoryId: zod.string().min(1, "Category is required")
});

const productUpdateInput = zod.object({
    name: zod.string().min(1, "Name is required").optional(),
    price: zod.number().positive("Price must be positive").optional(),
    stock: zod.number().positive("Stock must be positive").default(0).optional(),
});

module.exports = {
    productInput, productUpdateInput, categoryInput, categoryUpdateInput
}