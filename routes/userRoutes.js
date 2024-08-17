import express from 'express';
import {  deleteUser, getUsers } from "../controller/userInfo.js";

const router = express.Router();


router.get("/getUsers", getUsers);
router.delete("/deleteUser/:id", deleteUser)


export default router;