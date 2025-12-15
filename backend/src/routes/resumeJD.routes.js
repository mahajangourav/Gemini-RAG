import express from "express";
import { matchResumeWithJD } from "../features/resumeJDMatch/resumeJD.controller.js";

const router = express.Router();

router.post("/resume-jd-match", matchResumeWithJD);

export default router;
