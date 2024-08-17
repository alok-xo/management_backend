import express from 'express';
import { registerUser, loginUser, registerAdmin } from '../controller/authController.js';

const router = express.Router();

router.post('/register/user', registerUser);

router.post('/register/admin', registerAdmin);

router.post('/login', loginUser);

export default router;
