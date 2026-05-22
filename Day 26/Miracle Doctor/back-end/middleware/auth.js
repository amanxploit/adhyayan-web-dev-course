const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

const isDoctor = (req, res, next) => {
    if (req.userRole !== 'doctor' && req.userRole !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Doctor only.' });
    }
    next();
};

const isPatient = (req, res, next) => {
    if (req.userRole !== 'patient') {
        return res.status(403).json({ error: 'Access denied. Patient only.' });
    }
    next();
};

const isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    next();
};

module.exports = { authMiddleware, isDoctor, isPatient, isAdmin };