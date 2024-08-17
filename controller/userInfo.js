import User from '../models/userauth.js';

export const getUsers = async (req, res) => {
    try {
        const { name } = req.query;

        const searchQuery = { role: 'user' };

        if (name) {
            searchQuery.name = { $regex: name, $options: 'i' };
        }

        const users = await User.find(searchQuery);

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

