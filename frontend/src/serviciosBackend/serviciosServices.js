import api from "./api.js"

export const listarServicios = async () => {
  const respuesta = await api.get("/servicios")
  return respuesta.data
}

export const crearServicio = async (datos) => {
  const respuesta = await api.post("/servicios", datos)
  return respuesta.data
}

export const actualizarServicio = async (id, datos) => {
  const respuesta = await api.put(`/servicios/${id}`, datos)
  return respuesta.data
}


export const eliminarServicio = async (id) => {
  const respuesta = await api.delete(`/servicios/${id}`)
  return respuesta.data
}