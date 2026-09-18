export const adminMiddleware = (req, res, next) => {

    // Check user's role
    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin access required"
        });
    }

    // User is admin → continue
    next();
};