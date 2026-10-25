import "dotenv/config";
import express from "express";
import authRouter from "./routes/auth.routes.js"
import serviciosRouter from "./routes/servicios.routes.js"
import reservasRouter from "./routes/reservas.routes.js"
import { loggerMiddleware } from './middlewares/logger.middleware.js';

const app = express();

app.use(express.json());
app.use(loggerMiddleware)
app.use("/auth",authRouter)
app.use("/servicios", serviciosRouter)
app.use("reservas",reservasRouter)

app.listen(3000, () => {
  console.log("tamo en el puerto 3000")
})

//se arreglo