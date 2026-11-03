
import { useState } from "react"
import { Stack } from "expo-router"
import Splash from "./splash.jsx"
import { useEffect } from "react"
import { solicitudPermisos } from "../serviciosBackend/notificacionesServices.js"

export default function Layout() {
  const [mostrarSplash, setMostrarSplash] = useState(true)
  
  useEffect(() => {
    solicitudPermisos()
  }, [])

  const entrar = () => {
    setMostrarSplash(false)
  }


  if (mostrarSplash) {
    return <Splash onFinish={entrar} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />
}
