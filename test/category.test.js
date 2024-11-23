const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const app = express();
const CATEGORY_ROUTER = require('../route/category'); // Adjust the path to your router
const { Category, Product } = require('../db/model'); // Adjust the path to your models

app.use(require('express').json());
app.use('/categories', CATEGORY_ROUTER);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Category.deleteMany();
  await Product.deleteMany();
});

describe('Category Routes', () => {
  test('Create a category', async () => {
    const response = await request(app)
      .post('/categories/create')
      .send({
        name: 'Electronics',
        description: 'Devices and gadgets',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Category Created Successfully');
    expect(response.body.categoryId).toBeDefined();
  });

  test('Get all categories', async () => {
    await Category.create({ name: 'Electronics', description: 'Devices and gadgets' });
    const response = await request(app).get('/categories');

    expect(response.status).toBe(200);
    expect(response.body['Total Categories']).toBe(1);
    expect(response.body.categories[0].name).toBe('Electronics');
  });

  test('Find category by ID with associated products', async () => {
    const category = await Category.create({ name: 'Electronics', description: 'Devices and gadgets' });
    await Product.create({
      name: 'Laptop',
      price: 1000,
      stock: 10,
      categoryId: category._id,
    });

    const response = await request(app).get(`/categories/${category._id}`);

    expect(response.status).toBe(200);
    expect(response.body.category.name).toBe('Electronics');
    expect(response.body.products[0].name).toBe('Laptop');
  });

  test('Update a category', async () => {
    const category = await Category.create({ name: 'Electronics', description: 'Devices and gadgets' });

    const response = await request(app)
      .put(`/categories/update/${category._id}`)
      .send({
        name: 'Home Electronics',
        description: 'Home devices and gadgets',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Category updated Successfully');

    const updatedCategory = await Category.findById(category._id);
    expect(updatedCategory.name).toBe('Home Electronics');
    expect(updatedCategory.description).toBe('Home devices and gadgets');
  });

  test('Delete a category and set associated products categoryId to null', async () => {
    const category = await Category.create({ name: 'Electronics', description: 'Devices and gadgets' });
    const product = await Product.create({
      name: 'Laptop',
      price: 1000,
      stock: 10,
      categoryId: category._id,
    });

    const response = await request(app).delete(`/categories/delete/${category._id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Category deleted successfully');
    expect(response.body.deleted_category.name).toBe('Electronics');

    const updatedProduct = await Product.findById(product._id);
    expect(updatedProduct.categoryId).toBeNull();
  });
});
