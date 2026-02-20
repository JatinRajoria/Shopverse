const jwt = require('jsonwebtoken');

// ye hai ek middleware jo apko role based authentication provide karega. Aap isko apne routes me use kar sakte ho jaha aapko user ke role ke hisab se access dena hai.
function createAuthMiddleware(roles = ["user"]) {
    // ye higher order function hai jo ek middleware function return karta hai. Aap isme roles pass kar sakte ho jise aap allow karna chahte ho, by default ye "user" role ko allow karega.
    return function authMiddleware(req, res, next) {
        const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (!roles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
            }
            req.user = decoded; // Attach user info to request object
            next();
        }
        catch (err) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
}
}

module.exports = createAuthMiddleware;