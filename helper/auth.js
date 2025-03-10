const jwt = require("jsonwebtoken");
const User = require("../models/user.models");
const Role = require('../models/role.models');

const auth = (moduleName) => async (req, res, next) => {
    console.log("moduleName", moduleName);

    try {
        const token = req?.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            return res.status(403).json({ status: 403, message: 'Token not available' });
        }

        let validateToken;
        try {
            validateToken = await jwt.verify(token, process.env.SECRET_KEY);
        } catch (jwtError) {
            if (jwtError.name === 'JsonWebTokenError') {
                return res.status(401).json({ 
                    status: 401, 
                    message: 'Invalid token format', 
                    error: jwtError.message 
                });
            } else if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    status: 401, 
                    message: 'Token has expired', 
                    error: jwtError.message 
                });
            }
            throw jwtError;
        }

        const user = await User.findById(validateToken._id);

        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        const roles = await Role.find({ _id: { $in: user.role } });

        const rolePermissions = roles.reduce((acc, role) => {
            return acc.concat(role.permissions);
        }, []);

        req.user = {
            permissions: rolePermissions,
            role: user.role,
            id: user._id
        }

        if (!rolePermissions.includes(moduleName)) {
            return res.status(403).json({ 
                status: 403, 
                message: 'You do not have access to this module.' 
            });
        }

        next();

    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({ 
            status: 500, 
            message: 'Authentication error', 
            error: error.message 
        });
    }
}

module.exports = auth;