import jwt from 'jsonwebtoken';

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
    console.log("verifyToken")
    // Get token from cookie
    // const token = req.cookies.token;

    const authHeader = req.headers.authorization;
    let token;
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }
    if (!token) {
        return res.status(401).json({
            message: 'Access denied. No token provided.',
            success: false,
        });
    }
    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("Token verification error:", error);
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({
                message: 'Token has expired. Please log in again.',
                success: false,
            });
        }
        return res.status(403).json({
            message: 'Invalid token.',
            success: false,
        });
    }
}