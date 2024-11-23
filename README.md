# Vistaar - BE
Backend or Server of Ecommerce webapp which have CRUD operation relate to Products and Categories.

# Features
Create, Read, Update, and Delete (CRUD) operations for both products and categories.
Products are associated with categories via a categoryId reference.
Validation and error handling for data integrity.
Organized API structure and documentation for endpoints

## 1. Clone the Repository
Clone this repository using the following command: git clone https://github.com/Satya1612t/vistaar-be.git

## 2. Install dependencies (npm install or yarn install)
Run command step-by-step to run error free server
  - npm install
  - npm install express mongoose zod
  - npm install dotenv

Rum command for Testing dependencies run:
  - npm install --save-dev jest supertest mongodb-memory-server

## 3. Setup Environment Variable
Create a .env file at the same level as your index.js file and add the following content:
  - MONGO_URI=your_mongo_db_connection_string_here
  - PORT=3000 || or some randome port

## 4. Start the server (npm start or yarn start)
Run command to start server:
  - npm start
Run command to test server:
  - npm test

## 5. Test the Following API using Postman or Browser
  - Sample URL: http://localhost:3000
  - Endpoints:
      - GET / ----> This return Welcome Message as response.
  - Products:
      - POST /products/create
      - GET /products/
      - GET /products/:id
      - PATCH /products/update/:id
      - DELETE /products/delete/:id
  - Categories:
      - POST /categories/create
      - GET /categories/
      - GET /categories/:id
      - PUT /categories/update/:id
      - DELETE /categories/delete/:id

# Schema Design and Relationships
## Category Schema
The Category schema defines the structure for product categories. Each category contains:

 - name: A unique and required string field to identify the category.
 - description: An optional field to describe the category.
 - timestamps: Automatically includes createdAt and updatedAt fields.


## Product Schema
The Product schema defines the structure for products. Each product contains:

 - name: A unique and required string field to identify the product.
 - price: A required number field with a minimum value of 0.
 - stock: A required field that defaults to 0, representing the available quantity.
 - categoryId: A required field referencing the Category model, establishing a relationship between products and categories.
 - timestamps: Automatically includes createdAt and updatedAt fields.

## Relationship
 - One-to-Many Relationship:
A single category can be associated with multiple products.
This relationship is maintained by storing the categoryId reference in the Product schema.

## Diagram Representation
 - Category (1) ---> (∞) Product

### Feel free to use this repository if find useful.
