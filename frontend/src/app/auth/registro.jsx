import { useState } from "react"
import {  View,  Button,  Text,  TextInput,  Pressable, StyleSheet, Alert,  ActivityIndicator } from "react-native"
import { router } from "expo-router"
import { registrarUsuario } from "../../serviciosBackend/authServices"

export default function Registro() {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rol, setRol] = useState("")
  const [cargando, setCargando] = useState(false)

  
  
const handleRegistro = async () => {

  try {
    setCargando(true);

    const respuesta = await registrarUsuario({
      nombre: nombre.trim(),
      email: email.trim(),
      password,
      rol: rol || "cliente",
    })

    Alert.alert(
      "Registro exitoso", `tu cuenta se ha creado correctamente como ${respuesta.rol}`,
      [ { text: "Continuar",  onPress: () => router.replace("/auth/login")  } ] )

  } catch (error) {
    "error en registro intente nuevamente "
    
    Alert.alert("Error de registro")
  } finally {
    setCargando(false)
  }
}
  


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrate como cliente o administrador</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="digita tu nombre..."
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="digite su correo electronico..."
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="digite su contrasena..."
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.label}>Elige tu rol</Text>

      <View style={styles.rolesContainer}>
        <Pressable
          style={[styles.roleButton, rol === "cliente" && styles.roleSelected]}
          onPress={() => setRol("cliente")}
        >
          <Text
            style={[
              styles.roleText,
              rol === "cliente" && styles.roleTextSelected,
            ]}
          >
            Cliente
          </Text>
        </Pressable>

        <Pressable
          style={[styles.roleButton, rol === "admin" && styles.roleSelected]}
          onPress={() => setRol("admin")}
        >
          <Text
            style={[
              styles.roleText,
              rol === "admin" && styles.roleTextSelected,
            ]}
          >
            Administrador
          </Text>
        </Pressable>
      </View>

      <Text style={styles.helper}>
        Si no seleccionas ningun rol, se te asignara el rol de cliente por
        defecto
      </Text>

      <Pressable
        style={styles.registerButton}
        onPress={handleRegistro}
        disabled={cargando}
      >
        {cargando ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.registerButtonText}>Registrarse</Text>
        )}
      </Pressable>

      <Button title="volver a index" onPress={() => router.back("/index")} />
      <Button title="ir a login" onPress={() => router.push("/auth/login")} />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F5EF",
  },

  scrollContent: {
    flexGrow: 1,
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 28,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingRight: 12,
    marginBottom: 20,
  },

  backArrow: {
    fontSize: 32,
    lineHeight: 34,
    color: "#75452F",
    marginRight: 6,
  },

  backText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#75452F",
  },

  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 28,
  },

  brand: {
    color: "#28231F",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.7,
  },
  
  eyebrow: {
    color: "#A55F3E",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 10,
  },

  title: {
    color: "#28231F",
    fontSize: 28,
    lineHeight: 43,
    fontWeight: "800",
    letterSpacing: -1.5,
  },

  titleAccent: {
    color: "#A55F3E",
  },

  description: {
    color: "#766A60",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 10,
    marginBottom: 26,
  },

  form: {
    width: "100%",
  },

  label: {
    color: "#47372D",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },

  input: {
    minHeight: 54,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5D6C7",
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18,
    fontSize: 15,
    color: "#28231F",
  },

  rolesContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },

  roleButton: {
    flex: 1,
    minHeight: 120,
    position: "relative",
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5D6C7",
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },

  roleSelected: {
    backgroundColor: "#F0E5D9",
    borderColor: "#75452F",
    borderWidth: 1.5,
  },

  roleIcon: {
    fontSize: 24,
    color: "#A55F3E",
    marginBottom: 7,
  },

  roleTitle: {
    color: "#47372D",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 5,
  },

  roleTextSelected: {
    color: "#75452F",
  },

  roleDescription: {
    color: "#88796D",
    fontSize: 11,
    lineHeight: 16,
  },

  roleDescriptionSelected: {
    color: "#75452F",
  },

  selectedIndicator: {
    position: "absolute",
    right: 10,
    top: 10,
    width: 21,
    height: 21,
    borderRadius: 11,
    backgroundColor: "#75452F",
    alignItems: "center",
    justifyContent: "center",
  },

  checkmark: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  helper: {
    color: "#88796D",
    fontSize: 11,
    lineHeight: 17,
    marginBottom: 22,
  },

  registerButton: {
    minHeight: 58,
    backgroundColor: "#75452F",
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  buttonArrow: {
    position: "absolute",
    right: 20,
    color: "#FFFFFF",
    fontSize: 22,
  },

  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.985 }],
  },

  disabledButton: {
    opacity: 0.7,
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 24,
  },

  loginText: {
    color: "#766A60",
    fontSize: 13,
  },

  loginLink: {
    color: "#A55F3E",
    fontSize: 13,
    fontWeight: "800",
  },

  footer: {
    textAlign: "center",
    color: "#A3988D",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
    marginTop: 28,
  },
});
