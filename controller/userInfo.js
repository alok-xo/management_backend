import User from '../models/userauth.js';
import bcrypt from 'bcrypt';

export const getUsers = async (req, res) => {
    try {
        const { name } = req.query;

        const searchQuery = { role: 'user' };

        if (name) {
            searchQuery.name = { $regex: name, $options: 'i' };
        }

        // Find users and populate the tasks field with task details
        const users = await User.find(searchQuery).populate('tasks');

        const totalUsers = await User.countDocuments(searchQuery);

        res.status(200).json({
            success: true,
            totalUsers,
            users
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            // deletedUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, phone } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true
        });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const addUser = async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (role && role !== 'user') {
            return res.status(400).json({ message: 'Only users with the role "user" can be added' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            role
        });

        await newUser.save();

        res.status(201).json({ message: 'User added successfully', data: newUser });
    } catch (error) {
        console.error('Error adding user:', error.message); // Log the error message
        res.status(500).json({ message: 'Server error', error: error.message }); // Include the error message in the response
    }
};

export const getUserswithTask = async (req, res) => {
    try {
        const result = await User.aggregate([
            {
                $lookup: {
                    from: 'tasks',
                    localField: 'tasks',
                    foreignField: '_id',
                    as: 'tasks'
                }
            },
            {
                $match: {
                    tasks: { $ne: [] }
                }
            },
            {
                $facet: {
                    users: [
                        { $project: { name: 1, email: 1, phone: 1, role: 1, tasks: 1 } }
                    ],
                    totalCount: [
                        { $count: 'total' }
                    ]
                }
            }
        ]);

        const totalUsers = result[0].totalCount.length > 0 ? result[0].totalCount[0].total : 0;
        const users = result[0].users;

        res.json({ total: totalUsers, users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

