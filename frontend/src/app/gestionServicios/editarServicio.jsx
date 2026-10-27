import { useEffect, useState } from "react"
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, ScrollView } from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import {listarServicios,actualizarServicio} from "../../serviciosBackend/serviciosServices.js"

export default function EditarServicio() {
  const { id } = useLocalSearchParams()

  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [duracion, setDuracion] = useState("")
  const [precio, setPrecio] = useState("")
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)


  useEffect(() => {
    cargarServicio()
  }, [id])

  const cargarServicio = async () => {
    try {
      setCargando(true)

      const servicios = await listarServicios();

      const servicio = servicios.find((item) => String(item.id) === String(id))

      if (!servicio) {
        Alert.alert("no se encuentra el servicio")
        router.back()
        return
      }
      
      setNombre(servicio.nombre)
      setDescripcion(servicio.descripcion)
      setDuracion(String(servicio.duracion))
      setPrecio(String(servicio.precio))

    } catch (error) {
      "error cargando el servicio"
    } finally {
      setCargando(false) //en un finally porque si no esta en un finaly, no se ejecuta y la barrita se queda cargando sin parar
    }
  }



  const handleActualizar = async () => {
  
    const duracionNumero = Number(duracion)
    const precioNumero = Number(precio)

    if (!Number.isInteger(duracionNumero) || duracionNumero <= 0) {
      Alert.alert("el tiempo y precio debe ser mayor a 0" )
      return
    }

    try {
      setGuardando(true);

      await actualizarServicio(Number(id), {
        nombre: nombre,
        descripcion: descripcion,
        duracion: duracionNumero,
        precio: precioNumero,
      })

      Alert.alert(
        "Servicio actualizado",
        "cambios guardados correctamente",
        [
          { text: "Continuar", onPress: () => router.replace("/gestionServicios/servicios") }
        ]
      )

    } catch (error) {
        "error actualizando el servicio";
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" />
        <Text>Cargando servicio...</Text>
      </View>
    )
  }


  return (
    <ScrollView contentContainerStyle={styles.contenedor}>
      <Text style={styles.titulo}>Editar servicio</Text>

      <Text style={styles.etiqueta}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Nombre del servicio"
        editable={!guardando}
      />

      <Text style={styles.etiqueta}>descripcion</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={descripcion}
        onChangeText={setDescripcion}
        placeholder="Descripcion del servicio"
        multiline
        editable={!guardando}
      />

      <Text style={styles.etiqueta}>duracion en minutos</Text>
      <TextInput
        style={styles.input}
        value={duracion}
        onChangeText={setDuracion}
        keyboardType="number-pad"
        placeholder="digite la cantidad"
        editable={!guardando}
      />

      <Text style={styles.etiqueta}>precio</Text>
      <TextInput
        style={styles.input}
        value={precio}
        onChangeText={setPrecio}
        keyboardType="decimal-pad"
        placeholder="digite la cantidad"
        editable={!guardando}
      />

      {guardando ? ( <ActivityIndicator size="large" />) : ( <Button title="Guardar cambios" onPress={handleActualizar} />)}

      <View style={styles.botonVolver}>
        <Button
          title="Cancelar"
          color="#666"
          onPress={() => router.back()}
          disabled={guardando}
        />
      </View>
    </ScrollView>
  )
}



const styles = StyleSheet.create({
  contenedor: {
    flexGrow: 1,
    padding: 60,
    backgroundColor: "#ffffff",
  },
  centrado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
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
})
