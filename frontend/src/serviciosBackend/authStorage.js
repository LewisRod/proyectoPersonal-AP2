import AsyncStorage from "@react-native-async-storage/async-storage"

const TOKEN_KEY = "token"
const USUARIO_KEY = "usuario"


export const guardarToken = async (token) => {
  await AsyncStorage.setItem(TOKEN_KEY, token)
}


export const obtenerToken = async () => {
  return await AsyncStorage.getItem(TOKEN_KEY)
}

export const guardarUsuario = async (usuario) => {
  await AsyncStorage.setItem(USUARIO_KEY, JSON.stringify(usuario))
}


export const obtenerUsuario = async () => {
  const usuario = await AsyncStorage.getItem(USUARIO_KEY)
  return usuario ? JSON.parse(usuario) : null
}

export const eliminarToken = async () => {
  await AsyncStorage.multiRemove([TOKEN_KEY, USUARIO_KEY])
}
