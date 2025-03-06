import express from "express";
import { createApplicant } from "../controllers/applicant.controller.js";

const router = express.Router();

router.get("/", createApplicant);

export default router;
