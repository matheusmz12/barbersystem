import express from "express";
import AgendamentoController from "../controllers/AgendamentoController.js";

const router = express.Router();

router.post("/", AgendamentoController.criar);
router.get("/", AgendamentoController.listar);

export default router;