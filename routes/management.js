import express from 'express';
import { addManager, deleteManager, getManagers, updateManager } from '../controller/managerData.js';
import { isAdmin, isManager } from '../middleware/adminMidware.js';
import { addTask, deleteTask, getAllTasks, updateTask } from '../controller/taskController.js';


const router = express.Router();
//manager
router.post("/addManager", isAdmin, addManager)
router.patch('/updateManager/:id', updateManager);
router.delete('/deleteManager/:id', deleteManager);
router.get('/getManagers', isAdmin, getManagers);

//Task
router.post("/addTask", addTask)
router.get("/getAllTasks", getAllTasks)
router.patch("/updateTask/:id", updateTask)
router.delete("/deleteTask/:id", deleteTask)

export default router;  