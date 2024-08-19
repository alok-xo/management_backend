import express from 'express';
const router = express.Router();
import Task from '../models/task.js';
import User from '../models/userauth.js';

export const addTask = async (req, res) => {
    try {
        const { title, description, assignedTo, priority, dueDate } = req.body;

        const newTask = new Task({
            title,
            description,
            assignedTo,
            priority,
            dueDate,
        });

        await newTask.save();

        const user = await User.findById(assignedTo);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.tasks.push(newTask._id);
        await user.save();

        res.status(201).json({ message: "Task added successfully", data: newTask });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: 'Failed to create task' });
    }
};




export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate('assignedTo');
        res.status(200).json({ tasks });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};



export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const task = await Task.findByIdAndUpdate(id, updates, { new: true });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json({ message: 'Task updated successfully', data: task });
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ error: 'Failed to update task' });
    }
};


export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findByIdAndDelete(id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const user = await User.findById(task.assignedTo);
        if (user) {
            user.tasks.pull(task._id);
            await user.save();
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
};
