import express from "express";
import { actualizarPerfil } from "../controllers/usuarios.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = express.Router();


router.put("/perfil", authMiddleware, actualizarPerfil)

export default router
