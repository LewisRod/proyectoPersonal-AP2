import api from "./api.js"

export const actualizarPerfil = async (nombre) => {
    const respuesta = await api.put("/usuarios/perfil", {
        nombre,
  })

  return respuesta.data
}
