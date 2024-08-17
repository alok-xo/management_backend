import User from '../models/user/userauth.js';

export const getUsers = async (req, res) => {
    try {
        const { name } = req.query;

        // Build the search query
        const searchQuery = { role: 'user' };

        // If the 'name' query param exists, add it to the search criteria
        if (name) {
            searchQuery.name = { $regex: name, $options: 'i' }; // 'i' makes the search case-insensitive
        }

        // Fetch users that match the search query
        const users = await User.find(searchQuery);

        // Get the total number of users that match the search query
        const totalUsers = await User.countDocuments(searchQuery);

        // Respond with the users and total count
        res.status(200).json({
            success: true,
            totalUsers,
            users
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
