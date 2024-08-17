import mongoose from 'mongoose';

const managerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    phonenumber: {
        type: Number,
        require: true
    },
    role: {
        type: String,
        default: 'manager'
    }
}, { timestamps: true });

const Manager = mongoose.model('Manager', managerSchema);

export default Manager;
