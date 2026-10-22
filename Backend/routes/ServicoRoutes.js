import express from "express";
import ServicoController from "../controllers/ServicoController.js";

const router = express.Router();

router.get("/", ServicoController.listar);
router.post("/", ServicoController.criar);
router.get("/:id", ServicoController.buscarPorId);
router.put("/:id", ServicoController.atualizar);
router.patch("/:id/desativar", ServicoController.desativar);
router.patch("/:id/reativar", ServicoController.reativar);



export default router;