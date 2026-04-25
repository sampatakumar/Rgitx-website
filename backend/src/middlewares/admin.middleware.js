// src/middlewares/admin.middleware.js
const admin = process.env.ADMIN_USERNAME
const password = process.env.ADMIN_PASSWORD

function adminMiddleware(req, res, next) {
    try {
        const { username, password: inputPassword } = req.headers;

        if (!username || !inputPassword) {
            return res.status(401).json({ message: "Credentials required" })
        }

        if (username !== admin || inputPassword !== password) {
            return res.status(403).json({ message: "Access denied. Admins only" })
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: "Server error" })
    }
}

module.exports = adminMiddleware