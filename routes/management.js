import express from 'express';
import { addManager, deleteManager, getManagers,  updateManager } from '../controller/managerData.js';

const router = express.Router();
router.post("/addManager", addManager)
router.patch('/updateManager/:id', updateManager);
router.delete('/deleteManager/:id', deleteManager);
router.get('/getManagers', getManagers);
export default router;