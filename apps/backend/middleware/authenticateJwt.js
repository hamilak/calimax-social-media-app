const jwt = require('jsonwebtoken');

// jwt authentication middleware
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    console.log(token)

    if (!token) {
        return res.status(403).send({ message: 'Access token missing or invalid' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                console.log('Token expired at:', err.expiredAt);
                return res.status(401).send({ message: 'Token expired', expiredAt: err.expiredAt });
            } else {
                console.log(err);
                return res.status(403).send({ message: 'Invalid token' });
            }
        }

        req.user = user;
        console.log('user:', user);
        next();
    });
};

// middleware to skip authentication for specific routes
const unless = (paths, middleware) => {
    return (req, res, next) => {
        const pathCheck = paths.some(path => req.path.startsWith(path));
        if (pathCheck) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
};

module.exports = { authenticateJWT, unless };
