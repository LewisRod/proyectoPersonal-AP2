
import { useState } from "react"
import { Stack } from "expo-router"
import Splash from "./splash.jsx"

export default function Layout() {
  const [mostrarSplash, setMostrarSplash] = useState(true)

  const entrar = () => {
    setMostrarSplash(false)
  }

  if (mostrarSplash) {
    return <Splash onFinish={entrar} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />
}
