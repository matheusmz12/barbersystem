import express from "express";
import AgendamentoController from "../controllers/AgendamentoController.js";
import autenticar from "../middlewares/autenticar.js";

const router = express.Router();

router.post("/", AgendamentoController.criar);
router.get("/",autenticar, AgendamentoController.listar);
router.get("/horarios-livres", AgendamentoController.horariosLivres);
router.get("/:id",autenticar, AgendamentoController.buscarPorId);
router.patch("/:id/concluir",autenticar, AgendamentoController.concluir);
router.patch("/:id/cancelar",autenticar, AgendamentoController.cancelar);

export default router;
