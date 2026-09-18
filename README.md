# Ecommerce Backend

A Node.js + Express + MongoDB backend for an e-commerce application. This project supports user authentication, product listing, filtering, admin product management, CSV import/export, and Swagger API documentation.

## Features

- User registration and login
- JWT-based authentication
- Product listing for published products
- Product filtering by category, price range, and sort order
- Admin product management
- Product publish/unpublish actions
- CSV import and export
- Swagger API documentation

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Swagger UI
- Multer for CSV upload

## Prerequisites

Before running this project locally, make sure you have the following installed:

- Node.js (v18 or later recommended)
- npm
- MongoDB running locally or a MongoDB connection string
- Git

## Clone the Repository

```bash
git clone <your-repository-url>
cd Ecommerce-Backend
```

If your folder name is different, replace `Ecommerce-Backend` with the actual project folder name.

## Install Dependencies

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root of the project and add the following values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
JWT_SECRET=your_super_secret_key_here
```

Notes:

- `PORT` is the local server port.
- `MONGO_URI` should point to your MongoDB instance.
- `JWT_SECRET` is used for signing user tokens. Use a strong random secret in production.

If MongoDB is not installed locally, you can run it using a local MongoDB service or update `MONGO_URI` to your cloud MongoDB connection string.

## Start the Server

Run the following command:

```bash
npm start
```

Once the server starts successfully, you should see output similar to:

```bash
Server running on port 5000
```

## Base URL

The backend runs at:

```text
http://localhost:5000
```

## Swagger Documentation

Swagger UI is available at:

```text
http://localhost:5000/api-docs
```

This gives you an interactive API explorer for endpoints and request payloads.

## Main API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login and receive JWT token

### User Routes

- `GET /api/users/products` - Get published products
- `GET /api/users/products/filter` - Filter products by category/price/sort
- `GET /api/users/products/:id` - Get published product by ID

### Admin Routes

- `GET /api/` - Get all products
- `GET /api/:id` - Get product by ID
- `POST /api/import` - Import products from CSV
- `GET /api/export` - Export products as CSV
- `PUT /api/:id` - Update product
- `PATCH /api/:id/publish` - Publish product
- `PATCH /api/:id/unpublish` - Unpublish product
- `DELETE /api/:id` - Delete product

## Example Request

### Register a User

```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sudeep",
    "email": "sudeep@gmail.com",
    "password": "123456",
    "role": "user"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sudeep@gmail.com",
    "password": "123456"
  }'
```

### Access Protected Product Route

```bash
curl http://localhost:5000/api/users/products \
  -H "Authorization: Bearer <your_jwt_token>"
```

## Notes

- Admin-only operations require an admin role and valid JWT token.
- Make sure MongoDB is running before starting the app.
- Keep your `.env` file private and do not commit secrets to version control.

## Troubleshooting

### MongoDB connection error

Check if MongoDB is running locally and that your `MONGO_URI` is correct.

### Server does not start

Verify that:

- Node modules are installed using `npm install`
- `.env` file exists and has valid values
- No other app is already running on the configured port

### JWT errors

Ensure the token is sent in the `Authorization` header as:

```text
Authorization: Bearer <token>
```

## License

This project is licensed under the ISC license.
