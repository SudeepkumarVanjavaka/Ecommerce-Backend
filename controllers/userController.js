import User from "../models/userModels.js";
import Product from "../models/productModels.js";
import bcrypt from "bcryptjs"; // hashing password
import jwt from "jsonwebtoken";

// User registration
export const registerUser = async (req, res) => {
    try {
        // Get user data
        const { name, email, password,role } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        // Check email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);
        const safeRole = role === "admin" ? "admin" : "user";
        // Create user
        const user = await User.create({
            userId: "U" + Date.now(),
            name,
            email,
            password: hashedPassword,
            role: safeRole
        });

        // Send response
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                userId: user.userId,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Could not register user",
            error: error.message
        });
    }
};


// User login
export const loginuser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check password
        const ispasswordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!ispasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.userId,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // Send response
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token: token
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Could not login user",
            error: error.message
        });
    }
};


// Get published products
export const getPublishedProducts = async (req, res) => {
    try {
        // Get published products from database
        const products = await Product.find({
            published: true
        });

        // Check published products
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No published products found"
            });
        }

        // Send products
        res.status(200).json({
            success: true,
            message: "Published products fetched successfully",
            data: products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Could not fetch published products",
            error: error.message
        });
    }
};


// Get published product by ID
export const getPublishedProductsById = async (req, res) => {
    try {
        // Get product ID from request
        const productId = req.params.id;

        // Find product and check published
        const product = await Product.findOne({
            _id: productId,
            published: true
        });

        // If not found
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Published product not found"
            });
        }

        // Send product
        res.status(200).json({
            success: true,
            message: "Published product fetched successfully",
            data: product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Could not fetch product",
            error: error.message
        });
    }
};


// Filter products
export const filterproducts = async (req, res) => {
    try {
        // Get filter values from request
        const { category, minPrice, maxPrice } = req.query;

        // Create filter condition
        const filterCondition = {};

        if (category) {
            filterCondition.category = category;
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            filterCondition.price = {};

            if (minPrice !== undefined) {
                filterCondition.price.$gte = Number(minPrice);
            }

            if (maxPrice !== undefined) {
                filterCondition.price.$lte = Number(maxPrice);
            }
        }

        // Only find published products
        const products = await Product.find({
            ...filterCondition,
            published: true
        });

        // If no products
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No published products found for the given filters"
            });
        }

        // Send products
        res.status(200).json({
            success: true,
            message: "Published products fetched successfully",
            data: products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Could not filter products",
            error: error.message
        });
    }
};