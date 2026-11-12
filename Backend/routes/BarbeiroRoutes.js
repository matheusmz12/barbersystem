import express from "express";
import BarbeiroController from "../controllers/BarbeiroController.js";
import autenticar from "../middlewares/autenticar.js";

const router = express.Router();

router.get("/", BarbeiroController.listar);
router.post("/",autenticar, BarbeiroController.criar);
router.get("/:id", BarbeiroController.buscarPorId);
router.put("/:id",autenticar, BarbeiroController.atualizar);
router.patch("/:id/desativar",autenticar, BarbeiroController.desativar);
router.patch("/:id/reativar",autenticar, BarbeiroController.reativar);

export default router;