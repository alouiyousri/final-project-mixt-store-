# Mixt Store - E-commerce Platform
For support, email your-email@example.com or open an issue in the repository.

## Support

This project is licensed under the ISC License.

## License

5. Open a Pull Request
4. Push to the branch (`git push origin feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
1. Fork the repository

## Contributing

- ✅ MongoDB injection protection
- ✅ CORS configuration
- ✅ Input validation and sanitization
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Rate limiting to prevent abuse
- ✅ Helmet.js for security headers

## Security Features

```
└── .env.example              # Environment variables template
├── package.json              # Backend dependencies
├── server.js                 # Express server entry point
├── front/                    # React frontend application
│   └── multer.js             # File upload configuration
│   ├── errorHandler.js       # Error handling utilities
│   ├── cloudinary.js         # Cloudinary configuration
├── utils/
│   └── product.js            # Product routes
│   ├── Order.js              # Order routes
│   ├── admine.js             # Admin routes
├── routers/
│   └── product.js            # Product model
│   ├── Order.js              # Order model
│   ├── admin.js              # Admin model
├── models/
│   └── validation.js         # Input validation middleware
│   ├── isAuth.js             # JWT authentication middleware
├── middleware/
│   └── product.js            # Product CRUD logic
│   ├── Order.js              # Order management logic
│   ├── admin.js              # Admin authentication logic
├── controllers/
│   └── connectDB.js          # MongoDB connection
├── config/
.
```

## Project Structure

- `DELETE /api/orders/:orderId` - Delete order (admin only)
- `PUT /api/orders/:orderId/status` - Update order status (admin only)
- `GET /api/orders/:orderId/facture` - Get order invoice (admin only)
- `GET /api/orders/:orderId` - Get single order (admin only)
- `GET /api/orders` - Get all orders (admin only)
- `POST /api/orders` - Create order (public)
### Order Routes

- `DELETE /api/products/delete/:id` - Delete product (admin only)
- `PUT /api/products/edit/:id` - Update product (admin only)
- `POST /api/products/addproduct` - Add product (admin only)
- `GET /api/products/:id` - Get single product (public)
- `GET /api/products` - Get all products (public)
### Product Routes

- `GET /api/admin/profile` - Get admin profile (protected)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/register` - Register new admin
### Admin Routes

## API Endpoints

```
npm start
```bash

### Production Mode

   Frontend will run on http://localhost:3000
   ```
   npm start
   cd front
   ```bash
2. **Start the frontend (in a new terminal)**

   Server will run on http://localhost:5000
   ```
   npm run dev
   ```bash
1. **Start the backend server**

### Development Mode

## Running the Application

   ```
   CLOUDINARY_API_SECRET=your_api_secret
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   JWT_SECRET=your_jwt_secret_key
   DB_URI=your_mongodb_connection_string
   NODE_ENV=development
   PORT=5000
   ```env
   Update the `.env` file with your configuration:
   
   ```
   cp .env.example .env
   ```bash
   Create a `.env` file in the root directory:
   
4. **Set up environment variables**

   ```
   cd ..
   npm install
   cd front
   ```bash
3. **Install frontend dependencies**

   ```
   npm install
   ```bash
2. **Install backend dependencies**

   ```
   cd final-project-mixt-store-
   git clone <your-repo-url>
   ```bash
1. **Clone the repository**

## Installation

- Cloudinary account (for image uploads)
- MongoDB (local or Atlas)
- Node.js (v14 or higher)

## Prerequisites

- React Toastify for notifications
- Axios for API calls
- React Bootstrap for UI
- React Router for navigation
- Redux Toolkit for state management
- React 19
### Frontend

- Rate limiting for API protection
- Helmet for security headers
- Express Validator for input validation
- Cloudinary for image storage
- JWT for authentication
- MongoDB with Mongoose
- Node.js & Express.js
### Backend

## Tech Stack

- ✅ Input validation and error handling
- 🔒 Secure routes with JWT authentication
- 📱 Responsive design with React Bootstrap
- 🖼️ Image upload to Cloudinary
- 👤 Admin authentication and authorization
- 📦 Order processing with stock management
- 🛒 Shopping cart functionality
- 🛍️ Product management (CRUD operations)

## Features

A full-stack e-commerce application built with Node.js, Express, MongoDB, and React.


