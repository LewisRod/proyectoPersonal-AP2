import Router from "express"
import { crearReserva,misReservas,listarReservas,cambiarEstadoReserva, cancelarReserva } from "../controllers/reservas.controller.js"
import { authMiddleware } from "../middlewares/esAdmin.middleware.js"
import { esAdmin } from "../middlewares/esAdmin.js"

const router = Router()

router.post("/", authMiddleware, crearReserva)
router.get("/mis-reservas", authMiddleware, misReservas)
router.get("/", authMiddleware, esAdmin, listarReservas)
router.put("/:id/estado", authMiddleware, esAdmin, cambiarEstadoReserva)
router.delete("/:id", authMiddleware, cancelarReserva)

export default router


//ruts admin