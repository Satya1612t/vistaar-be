# Project Name
Backend or Server of Ecommerce webapp which have CRUD operation relate to Products and Categories.

# Follow these steps to run this server succesufully.

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

### Feel free to use this repository if find useful.
