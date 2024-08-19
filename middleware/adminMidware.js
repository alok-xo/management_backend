import jwt from 'jsonwebtoken';
import User from '../models/userauth.js' 
import Manager from '../models/managerModel.js';

// export const authenticate = async (req, res, next) => {
//     try {
//         const token = req.headers.authorization?.split(" ")[1];
//         if (!token) return res.status(401).json({ message: "No token provided" });

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // Check if user is a manager or a general user/admin
//         let user;
//         if (decoded.role === 'manager') {
//             user = await Manager.findById(decoded._id).select('name role');
//         } else {
//             user = await User.findById(decoded._id).select('name role');
//         }

//         if (!user) return res.status(401).json({ message: "User not found" });

//         req.user = { ...decoded, name: user.name }; // Attach user details to request
//         next();
//     } catch (error) {
//         console.error("Error in authenticate middleware:", error);
//         res.status(401).json({ message: "Unauthorized" });
//     }
// };

export const isAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token provided" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id).select('role');

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};

export const isManager = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token provided" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const manager = await Manager.findById(decoded._id).select('role');

        if (!manager || manager.role !== 'manager') {
            return res.status(403).json({ message: "Access denied" });
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};
