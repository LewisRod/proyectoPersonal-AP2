import prisma from "../db.js";

export const crearServicio = async (req, res) => {
    const { nombre, descripcion, duracion, precio } = req.body
    
    if (!nombre || !descripcion || !duracion || !precio) {
        return res.status(401).json({mensaje:"los campos son obligatorios"})
    }

    if (typeof nombre != "string" || typeof descripcion != "string" || typeof duracion != "number" || typeof precio != "number") {
         return res.status(403).json({ mensaje: "los campos nombre,descripcion son string y duracion y precio son numeros" });
    }

    if (req.usuario.rol != "admin") {
        return res.status(404).json({mensaje:"solo los administradores crean servicios"})
    }

    const servicio = await prisma.servicio.create({
        data: { nombre, descripcion, duracion, precio }
    })

    res.status(201).json(servicio)
}

export const listarServicio = async (req, res) => {
  const servicio = await prisma.servicio.findMany();

  res.status(201).json(servicio);
};



export const actualizarServicio = async (req, res) => {

  const id = parseInt(req.params.id);
  const { nombre, descripcion, duracion, precio } = req.body;

  if (req.usuario.rol != "admin") {
    return res
      .status(404)
      .json({ mensaje: "solo los administradores actualizan servicios" });
  }

  const servicio = await prisma.servicio.update({
    where: { id },
    data: { nombre, descripcion, duracion, precio },
  });

  res.status(201).json(servicio);
};


export const eliminarServicio = async (req, res) => {
    const id = parseInt(req.params.id);

    if (req.usuario.rol != "admin") {
      return res.status(404).json({ mensaje: "solo los administradores eliminan servicios" });
    }

    const servicio = await prisma.servicio.delete({
      where: { id }
    });

    res.status(201).json({servicio,mensaje:"eliminado correctamiente"});
  }
 
