import express from "express";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { setupSwagger } from "./swagger.js";

dotenv.config();

const app = express();
// Connect MongoDB
connectDB();

// Setup Swagger
setupSwagger(app);

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api", adminRoutes);

// Home route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "E-Commerce API is running"
    });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});