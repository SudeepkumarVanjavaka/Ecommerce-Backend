import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    try {
        // Get token from request
        const token = req.headers.authorization?.split(" ")[1];

        // Check token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. Please login"
            });
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store user information
        req.user = decoded;

        // Continue to next middleware controller
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};