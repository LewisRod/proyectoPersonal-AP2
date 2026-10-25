import prisma from "../db.js";


export const crearReserva = async (req, res) => {
  try {
    const { servicioId, fecha, hora } = req.body;
    const usuarioId = req.usuario.id;
    const idServicio = parseInt(servicioId);


    if (!servicioId || !fecha || !hora) {
      return res
        .status(400)
        .json({ mensaje: "debes poner el id de servicio, la fecha y la hora" });
    }

    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(hora)) {
      return res.status(400).json({ mensaje: " el formato de la hora es: HH:mm, por ejemplo 11:30" })
    }

    if (idServicio <= 0) {
      return res.status(400).json({ mensaje: "el id no es valido" });
    }

    const servicio = await prisma.servicio.findUnique({
      where: { id: idServicio },
    });

    if (!servicio) {
      return res.status(404).json({ mensaje: "servicio no encontrado" });
    }

    const fechaReserva = new Date(fecha);

    if (fechaReserva < new Date()) {
      return res
        .status(400)
        .json({ mensaje: "no se puede reservar fecha pasada" });
    }

    const reservaExistente = await prisma.reserva.findFirst({
      where: { servicioId: idServicio, fecha: fechaReserva, hora,
        estado: {not: "cancelada"}
      }
    })

    if (reservaExistente) {
      return res.status(409).json({ mensaje: "servicio ya reservado en ese horario, reserve en un horario diferente" })
    }

    const reserva = await prisma.reserva.create({
      data: { fecha: fechaReserva, hora, usuarioId, servicioId: idServicio },
    })

    return res.status(201).json({ mensaje: "reserva creada", reserva });
  } catch (error) {
    console.error("error creando la reserva:", error);
  }
}





export const misReservas = async (req, res) => {
  try {
    const id = req.usuario.id;

    const reservas = await prisma.reserva.findMany({
      where: { usuarioId: id },
      include: { servicio: true },
    });

    return res.status(200).json(reservas);
  } catch (error) {
    console.error("Error buscando las reservas:", error);

    return res.status(500).json({ mensaje: "error al obtener las reservas" });
  }
};




export const listarReservas = async (req, res) => {
  try {
    const reservas = await prisma.reserva.findMany({
      include: { usuario: true, servicio: true },
    });

    return res.status(200).json(reservas);
  } catch (error) {
    console.error("error buscando las reservas:", error);

    return res
      .status(500)
      .json({ mensaje: "error al obtener todas las reservas" });
  }
};






export const cambiarEstadoReserva = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { estado } = req.body;

    if ( estado !== "pendiente" && estado !== "completada" && estado !== "cancelada") {
      return res.status(400).json({ mensaje: "estado incorrecto" });
    }

    const reserva = await prisma.reserva.update({
      where: { id },
      data: { estado },
    });

    return res.status(200).json({
      mensaje: "Estado actualizado correctamente",
      reserva,
    });
  } catch (error) {
    console.error("Error cambiando el estado:", error);

    return res.status(500).json({
      mensaje: "error cambiando estado de la reserva",
    });
  }
};





export const cancelarReserva = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const usuarioId = req.usuario.id;

    const reserva = await prisma.reserva.findUnique({
      where: { id }
    })

    if (!reserva) {
      return res.status(404).json({mensaje: "Reserva no encontrada" })
    }

    if (reserva.usuarioId !== usuarioId) {
      return res.status(403).json({ mensaje: "no se puede cancelar una reserva de otro usuario" })
    }

    if (reserva.estado !== "pendiente") {
      return res.status(400).json({mensaje: "solo se pueden cancelar reservas pendientes"})
    }

    const reservaCancelada = await prisma.reserva.update({
      where: { id },
      data: { estado: "cancelada" },
    })

    return res.status(200).json({ mensaje: "Reserva cancelada correctamente", reserva: reservaCancelada})
      
  } catch (error) {
    console.error("Error cancelando la reserva:", error)
  }
}