import express from 'express';
import { addUser, deleteUser, getUsers, getUserswithTask, updateUser } from "../controller/userInfo.js";
import { isAdmin } from '../middleware/adminMidware.js';


const router = express.Router();

router.get("/getUsers",  getUsers);
router.delete("/deleteUser/:id", deleteUser)
router.patch("/updateUser/:id", updateUser)
router.post("/addUser", addUser)

router.get("/getUserswithTask",  getUserswithTask);


export default router;