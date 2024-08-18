import express from 'express';
import { addManager, deleteManager, getManagers,  updateManager } from '../controller/managerData.js';
import { isAdmin } from '../middleware/adminMidware.js';

const router = express.Router();
router.post("/addManager", isAdmin, addManager)
router.patch('/updateManager/:id', updateManager);
router.delete('/deleteManager/:id', deleteManager);
router.get('/getManagers', isAdmin, getManagers);
export default router;