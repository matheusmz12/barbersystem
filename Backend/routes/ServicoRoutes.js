import express from "express";
import ServicoController from "../controllers/ServicoController.js";

const router = express.Router();

router.get("/", ServicoController.listar);
router.post("/", ServicoController.criar);
router.get("/:id", ServicoController.buscarPorId);
router.put("/:id", ServicoController.atualizar);



export default router;