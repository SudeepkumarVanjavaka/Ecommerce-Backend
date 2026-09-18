import express from "express";

import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    publishProduct,
    unpublishProduct,
    importProducts,
    exportProducts
} from "../controllers/adminControllers.js";

import { authMiddleware } from "../middleWare/authmiddleWare.js";
import { adminMiddleware } from "../middleWare/adminmiddleWare.js";
import upload from "../middleWare/uploadmiddleWare.js";

const router = express.Router();
// Import CSV - Admin
router.post(
    "/import",
    authMiddleware,
    adminMiddleware,
    upload.single("file"),
    importProducts
);
// Get products
router.get(
    "/",
    authMiddleware,
    getAllProducts
);
// Export CSV - Admin
router.get(
    "/export",
    authMiddleware,
    adminMiddleware,
    exportProducts
);


// Get product by ID
router.get(
    "/:id",
    authMiddleware,
    getProductById
);

// Update product - Admin
router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    updateProduct
);
// Publish product - Admin
router.patch(
    "/:id/publish",
    authMiddleware,
    adminMiddleware,
    publishProduct
);
// Unpublish product - Admin
router.patch(
    "/:id/unpublish",
    authMiddleware,
    adminMiddleware,
    unpublishProduct
);
// Delete product - Admin
router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteProduct
);


export default router;