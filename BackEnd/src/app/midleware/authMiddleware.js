const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.log(`[authMiddleware] Missing Authorization header for ${req.method} ${req.url}`);
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        console.log(`[authMiddleware] Token format invalid for ${req.method} ${req.url}`);
        return res.status(401).json({ message: "Unauthorized: Invalid token format" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(`[authMiddleware] Token verified for user: ${decoded.id}`);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(`[authMiddleware] Token verification failed:`, error.message);
        res.status(401).json({
            message: "Invalid token"
        });
    }

};