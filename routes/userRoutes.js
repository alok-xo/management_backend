import express from 'express';
import {  addUser, deleteUser, getUsers, updateUser } from "../controller/userInfo.js";

const router = express.Router();

router.get("/getUsers", getUsers);
router.delete("/deleteUser/:id", deleteUser)
router.patch("/updateUser/:id", updateUser)
router.post("/addUser", addUser)

export default router;