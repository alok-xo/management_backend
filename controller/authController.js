import User from '../models/userauth.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Manager from '../models/managerModel.js';


export const registerUser = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            role: 'user'  // Role is set to user
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: "User registered successfully", data: newUser, token });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const registerAdmin = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            role: 'admin'
        });

        await newAdmin.save();

        const token = jwt.sign({ id: newAdmin._id, role: newAdmin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: "Admin registered successfully", data: newAdmin, token });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// export const registerManager = async (req, res) => {
//     try {
//         const { name, email, phone, password } = req.body;

//         const existingManager = await User.findOne({ email });
//         if (existingManager) {
//             return res.status(400).json({ message: "Manager already exists" });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const newManager = new User({
//             name,
//             email,
//             phone,
//             password: hashedPassword,
//             role: 'manager'
//         });

//         await newManager.save();

//         const token = jwt.sign({ id: newManager._id, role: newManager.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

//         res.status(201).json({ message: "Manager registered successfully", data: newManager, token });
//     } catch (error) {
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// };


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });

        if (!user) {
            user = await Manager.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "User does not exist" });
            }
        }

        const isMatch = await bcrypt.compare(password.trim(), user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: "Login successful",
            data: user,
            role: user.role,
            token
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, email, phone },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}