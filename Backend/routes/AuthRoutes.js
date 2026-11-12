import express from "express"
import AuthController from "../controllers/AuthController.js"
import autenticar from "../middlewares/autenticar.js";

const router = express.Router()

router.post("/login",AuthController.login)

export default router;