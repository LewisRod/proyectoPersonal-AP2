import { useState } from "react"
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from "react-native"
import { router } from "expo-router"
import {iniciarSesion} from "../../serviciosBackend/authServices.js"
import { guardarToken,guardarUsuario } from "../../serviciosBackend/authStorage.js"


export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [cargando, setCargando] = useState(false)

  

const handleLogin = async () => {
  try {
    setCargando(true);

    const respuesta = await iniciarSesion({
      email: email.trim(),
      password,
    });


    await guardarToken(respuesta.token)

    await guardarUsuario(respuesta.usuario)

    router.replace("/gestionServicios")
  } catch (error) {
    "no se pudo iniciar sesion, intente de nuevo"

    Alert.alert("error iniciando sesion")
  } finally {
    setCargando(false)
  }
}
  
    
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>iniciar sesion</Text>

      <Text style={styles.etiqueta}>email</Text>

      <TextInput
        style={styles.input}
        placeholder="digite su correo..."
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.etiqueta}>contraseña</Text>

      <TextInput
        style={styles.input}
        placeholder="digite su contraseña..."
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {cargando ? (  <ActivityIndicator size="large" />) : (  <Button title="iniciar sesion" onPress={handleLogin} /> )}

  
        <Button
          title="volver a registro"
          onPress={() => router.replace("/auth/registro")}
        />

      <Button
        title="volver a index"
        onPress={() => router.back("/index")}
      />
    </View>
  )
}


const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 32,
  },
  etiqueta: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
});
