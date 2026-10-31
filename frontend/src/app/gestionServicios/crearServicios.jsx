import { useState } from "react"
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, ScrollView } from "react-native"
import { router } from "expo-router"
import { crearServicio } from "../../serviciosBackend/serviciosServices.js"

export default function CrearServicios() {
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [duracion, setDuracion] = useState("")
  const [precio, setPrecio] = useState("")
  const [cargando, setCargando] = useState(false)



  const handleCrearServicio = async () => {

    const duracionNumero = Number(duracion)
    const precioNumero = Number(precio)

    if (
      !Number(duracionNumero) ||
      !Number(duracionNumero) ||
      duracionNumero <= 0
    ) {
      Alert.alert("el tiempo y precio deben ser mayor a 0")
      return
    }

    try {
      setCargando(true)

      await crearServicio({
        nombre: nombre,
        descripcion: descripcion,
        duracion: duracionNumero,
        precio: precioNumero,
      })

      Alert.alert("sevicio creado", "servicio creado correctamente", [
      { text: "Continuar", onPress: () => router.replace("/gestionServicios/servicios") }
      ])
      
    } catch (error) {
        "error al crear servicio intente de nuevo";
    } finally {
      setCargando(false)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.contenedor}>
      <Text style={styles.titulo}>Crear servicio</Text>

      <Text style={styles.etiqueta}>Nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="digite el servicio..."
        value={nombre}
        onChangeText={setNombre}
        editable={!cargando}
      />

      <Text style={styles.etiqueta}>Descripcion</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="describe el servicio"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        numberOfLines={4}
        editable={!cargando}
      />

      <Text style={styles.etiqueta}>Duracion en minutos</Text>
      <TextInput
        style={styles.input}
        placeholder="digite la cantidad..."
        value={duracion}
        onChangeText={setDuracion}
        keyboardType="number-pad"
        editable={!cargando}
      />

      <Text style={styles.etiqueta}>Precio</Text>
      <TextInput
        style={styles.input}
        placeholder="digite la cantidad..."
        value={precio}
        onChangeText={setPrecio}
        keyboardType="decimal-pad"
        editable={!cargando}
      />

      {cargando ? ( <ActivityIndicator size="large" /> ) : ( <Button title="Crear servicio" onPress={handleCrearServicio} /> )}

      <View style={styles.botonVolver}>
        <Button
          title="Volver a home"
          onPress={() => router.back("/gestionServicios")}
          disabled={cargando}
          color="#666"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexGrow: 1,
    padding: 60,
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 15,
    color: "#666",
    marginBottom: 24,
  },
  etiqueta: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 18,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  botonVolver: {
    marginTop: 12,
  },
});
