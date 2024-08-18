import express from 'express';
import { addUser, deleteUser, getUsers, updateUser } from "../controller/userInfo.js";
import { isAdmin } from '../middleware/adminMidware.js';


const router = express.Router();

router.get("/getUsers", isAdmin, getUsers);
router.delete("/deleteUser/:id", deleteUser)
router.patch("/updateUser/:id", updateUser)
router.post("/addUser", addUser)

export default router;