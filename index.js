const express = require('express');
// const { default: mongoose } = require('mongoose');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const CATEGORY_ROUTER = require('./route/category');
const PRODUCT_ROUTER = require('./route/product');

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Mongo Connected'))
    .catch((error) => console.log(error))

app.use('/categories', CATEGORY_ROUTER);
app.use('/products', PRODUCT_ROUTER);

app.get('/', (req, res) => {
    return res.send("Welcome to the Backend of Vistaar Ecommerce");
})

app.listen(process.env.PORT, () => {
    console.log(`Server are running at ${process.env.PORT}`);
})

