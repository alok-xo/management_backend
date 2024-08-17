import express from 'express';
import { registerUser, loginUser, registerAdmin, updateAdmin } from '../controller/authController.js';

const router = express.Router();

router.post('/register/user', registerUser);

router.post('/register/admin', registerAdmin);

router.post('/login', loginUser);

router.patch('/updateAdmin/:id', updateAdmin);

export default router;
