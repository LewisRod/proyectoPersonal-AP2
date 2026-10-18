import Router from "express";
import { listarServicio, crearServicio, eliminarServicio, actualizarServicio} from "../controllers/servicios.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router()

router.get("/", authMiddleware, listarServicio);

router.post("/", authMiddleware, crearServicio);

router.put("/:id", authMiddleware, actualizarServicio);

router.delete("/:id", authMiddleware, eliminarServicio);

export default router