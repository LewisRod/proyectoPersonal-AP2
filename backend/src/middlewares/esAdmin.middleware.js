export const esAdmin = async (req, res, next) => {
    if (req.usuario?.rol != "admin") {
        return res.status(403).json({Mensaje: "acceso denegado debes ser admin"})
    }
    next()
}


//si es admin 