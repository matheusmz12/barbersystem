import express from "express";
import BarbeiroController from "../controllers/BarbeiroController.js";

const router = express.Router();

router.get("/", BarbeiroController.listar);
router.post("/", BarbeiroController.criar);
router.get("/:id", BarbeiroController.buscarPorId);
router.put("/:id", BarbeiroController.atualizar);
router.patch("/:id/desativar", BarbeiroController.desativar);
router.patch("/:id/reativar", BarbeiroController.reativar);

export default router;