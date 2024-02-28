import jwt from 'jsonwebtoken';

function verifyToken(req, res, next) {
    const token = req.body.token

    if (!token) return res.status(401).json({ message: 'Access denied', valid: false});
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.tokenInfo = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token', valid: false });
    }
};

export default verifyToken;