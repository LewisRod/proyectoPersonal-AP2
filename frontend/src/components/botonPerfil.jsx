import { useState, useCallback } from "react";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { obtenerUsuario } from "../serviciosBackend/authStorage.js";

export default function BotonPerfil() {
  const [usuario, setUsuario] = useState(null);

useFocusEffect(
  useCallback(() => {
    const cargarUsuario = async () => {
      const datos = await obtenerUsuario();
      setUsuario(datos);
    };

    cargarUsuario();
  }, []),
)

  return (
    <Pressable style={styles.contenedor} onPress={() => router.push("/perfil")}>
      <Image
        source={require("../../assets/images/avatar.png")}
        style={styles.avatar}
      />

      <Text style={styles.nombre}>{usuario?.nombre || "Usuario"}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    alignSelf: "flex-end",
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "#315B91",
    justifyContent: "center",
    alignItems: "center",
  },
  inicial: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  nombre: {
    fontSize: 14,
    fontWeight: "600",
  },
});
