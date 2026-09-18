import express from "express";

import {
    registerUser,
    loginuser,
    getPublishedProducts,
    getPublishedProductsById,
    filterproducts
} from "../controllers/userController.js";

import { authMiddleware } from "../middleWare/authmiddleWare.js";

const router = express.Router();


// ==================== AUTHENTICATION ====================

// Register
router.post(
    "/register",
    registerUser
);

// Login
router.post(
    "/login",
    loginuser
);


// ==================== USER PRODUCT APIs ====================

// Get all published products
router.get(
    "/products",
    authMiddleware,
    getPublishedProducts
);

// IMPORTANT:
// Filter route must come BEFORE /products/:id
router.get(
    "/products/filter",
    authMiddleware,
    filterproducts
);

// Get published product by ID
router.get(
    "/products/:id",
    authMiddleware,
    getPublishedProductsById
);


export default router;