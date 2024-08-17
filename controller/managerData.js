import Manager from '../models/managerModel.js';
import bcrypt from 'bcrypt';


export const addManager = async (req, res) => {
    try {
        const { name, email, password, gender, age, phonenumber, role } = req.body;

        if (!name || !email || !password || !gender || !age || !phonenumber) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (role && role !== 'manager') {
            return res.status(400).json({ message: 'Only users with the role "manager" can be added' });
        }

        const existingManager = await Manager.findOne({ email });
        if (existingManager) {
            return res.status(400).json({ message: 'Manager with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newManager = new Manager({
            name,
            email,
            password: hashedPassword,
            gender,
            age,
            phonenumber,
            role: 'manager'
        });

        await newManager.save();

        res.status(201).json({ message: 'Manager added successfully', data: newManager });
    } catch (error) {
        console.error('Error adding manager:', error.message); // Log the error message
        res.status(500).json({ message: 'Server error', error: error.message }); // Include the error message in the response
    }
};

export const updateManager = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, gender, age, phonenumber } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Manager ID is required' });
        }

        const manager = await Manager.findById(id);
        if (!manager) {
            return res.status(404).json({ message: 'Manager not found' });
        }

        manager.name = name || manager.name;
        manager.email = email || manager.email;
        if (password) {
            manager.password = await bcrypt.hash(password, 10);
        }
        manager.gender = gender || manager.gender;
        manager.age = age || manager.age;
        manager.phonenumber = phonenumber || manager.phonenumber;

        await manager.save();

        res.status(200).json({ message: 'Manager updated successfully', data: manager });
    } catch (error) {
        console.error('Error updating manager:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const deleteManager = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Manager ID is required' });
        }

        // Find and delete the manager directly
        const manager = await Manager.findByIdAndDelete(id);
        if (!manager) {
            return res.status(404).json({ message: 'Manager not found' });
        }

        res.status(200).json({ message: 'Manager deleted successfully' });
    } catch (error) {
        console.error('Error deleting manager:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getManagers = async (req, res) => {
    try {
        const { name } = req.query;

        const searchQuery = { role: 'manager' };

        if (name) {
            searchQuery.name = { $regex: name, $options: 'i' };
        }

        const managers = await Manager.find(searchQuery);

        const totalManagers = await Manager.countDocuments(searchQuery);

        res.status(200).json({
            success: true,
            totalManagers,
            managers
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



