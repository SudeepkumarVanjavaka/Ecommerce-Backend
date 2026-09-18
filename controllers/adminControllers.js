import Product from "../models/productModels.js";
import User from "../models/userModels.js";
import csv from "csv-parser";
import { Readable } from "stream";
import { Parser } from "json2csv";

import fs from "fs";
import path from "path";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, published } = req.body;

        if (!name || !description || price === undefined || !category || stock === undefined) {
            return res.status(400).json({
                success: false,
                message: "All product fields are required"
            });
        }

        if (Number(price) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Price must be greater than 0"
            });
        }

        if (Number(stock) < 0) {
            return res.status(400).json({
                success: false,
                message: "Stock cannot be negative"
            });
        }

        const product = await Product.create({
            name,
            description,
            price,
            category,
            stock,
            published: published ?? false
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Could not create product",
            error: error.message
        });
    }
};


// GET ALL PRODUCTS + FILTER + SORT + PAGINATION
export const getAllProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, sort } = req.query;

        const filter = {};

        // User can see only published products
        if (req.user.role !== "admin") {
            filter.published = true;
        }

        if (category) {
            filter.category = category;
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};

            if (minPrice !== undefined) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice !== undefined) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        let sortOption = {};

        if (sort === "price_asc") {
            sortOption = { price: 1 };
        } else if (sort === "price_desc") {
            sortOption = { price: -1 };
        } else if (sort === "newest") {
            sortOption = { createdAt: -1 };
        }

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const products = await Product.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);

        res.status(200).json({
            success: true,
            products,
            page,
            limit,
            totalProducts,
            totalPages
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Could not fetch products",
            error: error.message
        });
    }
};


// GET ONE PRODUCT
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const filter = { _id: id };

        if (req.user.role !== "admin") {
            filter.published = true;
        }

        const product = await Product.findOne(filter);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
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


// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Could not update product",
            error: error.message
        });
    }
};


// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Could not delete product",
            error: error.message
        });
    }
};


// PUBLISH PRODUCT
export const publishProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { published: true },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product published successfully",
            data: product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Could not publish product",
            error: error.message
        });
    }
};


// UNPUBLISH PRODUCT
export const unpublishProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { published: false },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product unpublished successfully",
            data: product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Could not unpublish product",
            error: error.message
        });
    }
};


// GET ALL USERS
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json({
            success: true,
            data: users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Could not fetch users"
        });
    }
};


// GET ONE USER
export const getUserById = async (req, res) => {
    try {
        const user = await User.findOne({
            userId: req.params.id
        }).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Could not fetch user"
        });
    }
};


// UPDATE USER
export const updateUser = async (req, res) => {
    try {
        const { name, email, role } = req.body;

        const user = await User.findOneAndUpdate(
            { userId: req.params.id },
            { name, email, role },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Could not update user",
            error: error.message
        });
    }
};


// DELETE USER
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({
            userId: req.params.id
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Could not delete user"
        });
    }
};


// IMPORT PRODUCTS FROM CSV
export const importProducts = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "CSV file is required"
            });
        }

        const rows = await new Promise((resolve, reject) => {
            const data = [];

            Readable
                .from(req.file.buffer)
                .pipe(csv())
                .on("data", row => data.push(row))
                .on("end", () => resolve(data))
                .on("error", reject);
        });

        const products = [];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];

            const name = row.name?.trim();
            const description = row.description?.trim();
            const category = row.category?.trim();
            const price = Number(row.price);
            const stock = Number(row.stock);
            const published = row.published?.trim().toLowerCase();

            if (
                !name ||
                !description ||
                !category ||
                !Number.isFinite(price) ||
                price <= 0 ||
                !Number.isFinite(stock) ||
                stock < 0 ||
                (published !== "true" && published !== "false")
            ) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid record at row ${i + 2}`
                });
            }

            products.push({
                name,
                description,
                price,
                category,
                stock,
                published: published === "true"
            });
        }

        if (products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "CSV file contains no records"
            });
        }

        const result = await Product.insertMany(products);

        res.status(201).json({
            success: true,
            message: "Products imported successfully",
            count: result.length,
            data: result
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Could not import products",
            error: error.message
        });
    }
};


// EXPORT PRODUCTS TO CSV
export const exportProducts = async (req, res) => {
    try {
        const products = await Product.find().lean();

        const data = products.map(product => ({
            name: product.name,
            description: product.description,
            category: product.category,
            price: product.price,
            stock: product.stock,
            published: product.published
        }));

        const parser = new Parser({
            fields: [
                "name",
                "description",
                "category",
                "price",
                "stock",
                "published"
            ]
        });

        const csvData = parser.parse(data);

        const folderPath = path.join(process.cwd(), "exports");

        fs.mkdirSync(folderPath, { recursive: true });

        const filePath = path.join(folderPath, "products.csv");

        fs.writeFileSync(filePath, csvData, "utf8");

        console.log("CSV saved at:", filePath);

        res.download(filePath, "products.csv", (error) => {
            if (error) {
                console.log("Download error:", error);
            }
        });

    } catch (error) {
        console.log("Export error:", error);

        res.status(500).json({
            success: false,
            message: "Could not export products",
            error: error.message
        });
    }
};