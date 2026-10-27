import api from "./api.js";

export const registrarUsuario = async (datos) => {
  const respuesta = await api.post("/auth/register", datos)
  return respuesta.data
}

export const iniciarSesion = async (datos) => {
  const respuesta = await api.post("/auth/login", datos)
  return respuesta.data
}
