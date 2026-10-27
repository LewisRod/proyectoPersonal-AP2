import api from "./api.js";

export const crearReserva = async (datos) => {
  const respuesta = await api.post("/reservas", datos)
  return respuesta.data
}

export const listarMisReservas = async () => {
  const respuesta = await api.get("/reservas/mis-reservas")
  return respuesta.data
}

export const listarReservas = async () => {
  const respuesta = await api.get("/reservas")
  return respuesta.data
}

export const cambiarEstadoReserva = async (id, estado) => {
  const respuesta = await api.put(`/reservas/${id}/estado`, { estado })
  return respuesta.data
}

export const cancelarReserva = async (id) => {
  const respuesta = await api.delete(`/reservas/${id}`)
  return respuesta.data
}
