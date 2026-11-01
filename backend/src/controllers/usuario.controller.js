import prisma from "../db.js"

export const actualizarPerfil = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id
    const { nombre } = req.body

    
    if (!nombre || typeof nombre !== "string" || !nombre.trim()) {
      return res.status(400).json({
        error: "Debes poner el nombre bien",
      });
    }

    
    const usuario = await prisma.usuario.update({
      where: { id: usuarioId },
      data: { nombre: nombre.trim() },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
      },
    });

    return res.status(200).json({
      mensaje: "Perfil actualizado correctamente",usuario })
  } catch (error) {
    next(error)
  }
}
