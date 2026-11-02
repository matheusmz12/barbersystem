import express from "express";
import AgendamentoController from "../controllers/AgendamentoController.js";

const router = express.Router();

router.post("/", AgendamentoController.criar);

export default router;