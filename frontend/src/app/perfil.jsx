import { useEffect, useState } from "react"
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator} from "react-native"
 import { obtenerUsuario, eliminarToken, guardarUsuario} from "../serviciosBackend/authStorage.js"
import { actualizarPerfil } from "../serviciosBackend/usuarioServices.js"
import { router } from "expo-router";

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [nombre, setNombre] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const datosUsuario = await obtenerUsuario();

        if (datosUsuario) {
          setUsuario(datosUsuario);
          setNombre(datosUsuario.nombre);
        }
      } catch (error) {
        Alert.alert("Error", "no se pudo cargar el perfil");
      } finally {
        setCargando(false);
      }
    };

    cargarPerfil();
  }, []);

  

  const handleActualizarPerfil = async () => {
    try {
      setGuardando(true);

      const respuesta = await actualizarPerfil(nombre.trim());

      await guardarUsuario(respuesta.usuario);

      setUsuario(respuesta.usuario);
      setNombre(respuesta.usuario.nombre);

      Alert.alert("Éxito", "Perfil actualizado correctamente");
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.error || "No se pudo actualizar el perfil",
      );
    } finally {
      setGuardando(false);
    }
  };
  const handleCerrarSesion = async () => {
    await eliminarToken();
    router.replace("/auth/login");
  };

  if (cargando) {
    return <ActivityIndicator size="large" />;
  }

  if (!usuario) {
    return (
      <View style={styles.contenedor}>
        <Text>no se encontraron datos del usuario</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Mi perfil</Text>

      <Text style={styles.etiqueta}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Escribe tu nombre"
      />

      <Text style={styles.etiqueta}>Correo electrónico</Text>
      <Text style={styles.correo}>{usuario.email}</Text>

      {guardando ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Guardar cambios" onPress={handleActualizarPerfil} />
      )}

      <Button title="volver" color="red" onPress={router.back} />
      <Button title="cerrar sesion" color="red" onPress={handleCerrarSesion} />
    </View>
  );
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
  correo: {
    fontSize: 16,
    marginBottom: 24,
  },
});
