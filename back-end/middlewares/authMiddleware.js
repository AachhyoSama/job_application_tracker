import { verifyToken } from "../utils/authUtil.js";

export const authenticateUser = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        return res.status(401).json({ error: "Unauthorized: Missing token!" });
    }

    const token = authorizationHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: Invalid token!" });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ error: "Unauthorized: Invalid token!" });
    }

    req.user = decoded;

    next();
};

export const authorizeUser = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.role;

        if (!userRole) {
            return res
                .status(403)
                .json({ error: "Forbidden: Insufficient permissions!" });
        }

        const hasPermission = allowedRoles.includes(userRole);

        if (!hasPermission) {
            return res
                .status(403)
                .json({ error: "Forbidden: Insufficient permissions!" });
        }

        next();
    };
};
