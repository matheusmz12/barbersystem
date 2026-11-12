import express from "express";
import ServicoController from "../controllers/ServicoController.js";
import autenticar from "../middlewares/autenticar.js";

const router = express.Router();

router.get("/", ServicoController.listar);
router.post("/",autenticar, ServicoController.criar);
router.get("/:id", ServicoController.buscarPorId);
router.put("/:id",autenticar, ServicoController.atualizar);
router.patch("/:id/desativar",autenticar, ServicoController.desativar);
router.patch("/:id/reativar",autenticar, ServicoController.reativar);



export default router;