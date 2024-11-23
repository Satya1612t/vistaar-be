const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const app = express();
const PRODUCT_ROUTER = require('../route/product');
const { Product, Category } = require('../db/model');
app.use(express.json());
app.use('/products', PRODUCT_ROUTER);

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

beforeEach(async () => {
    await Product.deleteMany();
    await Category.deleteMany();
});

describe('Product Routes', () => {
    test('Create a product', async () => {
        const category = await Category.create({ name: 'Electronics' });
        const response = await request(app)
            .post('/products/create')
            .send({
                name: 'Laptop',
                price: 1000,
                stock: 10,
                categoryId: category._id.toString(),
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Product Created Successfully');
        expect(response.body.productId).toBeDefined();
    });

    test('Get all products', async () => {
        const category = await Category.create({ name: 'Electronics' });
        await Product.create({
            name: 'Laptop',
            price: 1000,
            stock: 10,
            categoryId: category._id,
        });

        const response = await request(app).get('/products');

        expect(response.status).toBe(200);
        expect(response.body.totalProducts).toBe(1);
        expect(response.body.filterProductByCategory[0].categoryName).toBe('Electronics');
    });

    test('Find a product by ID', async () => {
        const category = await Category.create({ name: 'Electronics' });
        const product = await Product.create({
            name: 'Laptop',
            price: 1000,
            stock: 10,
            categoryId: category._id,
        });

        const response = await request(app).get(`/products/${product._id}`);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Laptop');
        expect(response.body.categoryId.name).toBe('Electronics');
    });

    test('Update a product', async () => {
        const category = await Category.create({ name: 'Electronics' });
        const product = await Product.create({
            name: 'Laptop',
            price: 1000,
            stock: 10,
            categoryId: category._id,
        });

        const response = await request(app)
            .patch(`/products/update/${product._id}`)
            .send({
                name: 'Gaming Laptop',
                price: 1500,
                stock: 5,
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Product updated Successfully');
    });

    test('Delete a product', async () => {
        const category = await Category.create({ name: 'Electronics' });
        const product = await Product.create({
            name: 'Laptop',
            price: 1000,
            stock: 10,
            categoryId: category._id, 
        });
    
        const response = await request(app).delete(`/products/delete/${product._id}`);
    
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Product deleted successfully');
        expect(response.body.deletedProduct.name).toBe('Laptop'); 
    });    
});
