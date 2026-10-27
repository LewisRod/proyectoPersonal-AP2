import { useEffect, useState } from "react"
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, ActivityIndicator, Alert } from "react-native"
import { router,useLocalSearchParams } from "expo-router"
import { listarServicios } from "../../serviciosBackend/serviciosServices.js"
import { crearReserva } from "../../serviciosBackend/reservasServices.js"

export default function CrearReserva() {
  const [servicios, setServicios] = useState([])
  const [servicioId, setServicioId] = useState(null)
  const [fecha, setFecha] = useState("")
  const [hora, setHora] = useState("")
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const { servicioId: servicioIdParam } = useLocalSearchParams()
    

 useEffect(() => {
   cargarServicios()
 }, [])

 useEffect(() => {
   if (servicioIdParam) {
     setServicioId(Number(servicioIdParam))
   }
 }, [servicioIdParam])

  
  const cargarServicios = async () => {
    try {
      const datos = await listarServicios()
      setServicios(datos)
    } catch (error) {
      Alert.alert("no se pudieron cargar los servicios")
    } finally {
      setCargando(false)
    }
  }


  const handleCrearReserva = async () => {

    const fechaSeleccionada = new Date(`${fecha}T${hora}:00`)

    if (
      Number.isNaN(fechaSeleccionada.getTime()) || fechaSeleccionada <= new Date()) {
      Alert.alert("fecha invalida,  selecciona una fecha y hora futura");
      return
    }

    try {
      setGuardando(true);

      await crearReserva({
        servicioId,
        fecha,
        hora,
      })

      Alert.alert("reserva creada", "tu reserva se registro bien", [
        {
          text: "Continuar",
          onPress: () => router.replace("/reservas/misReservas"),
        },
      ])

    } catch (error) {
        "No se pudo crear la reserva. intente de nuevo"
      Alert.alert("error al reservar")
    } finally {
      setGuardando(false)
    }
  }



  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#75452F" />
        <Text>Cargando servicios...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.contenedor}>
      <Text style={styles.titulo}>Nueva reserva</Text>
      <Text style={styles.descripcion}>
        seleccione el servicio que necesite y cuando desee recibirlo
      </Text>

      <Text style={styles.etiqueta}>Selecciona un servicio</Text>

      {servicios.length === 0 ? (
        <Text style={styles.aviso}>no hay servicios disponibles</Text>
      ) : (
        servicios.map((servicio) => (
          <Pressable
            key={servicio.id}
            onPress={() => setServicioId(servicio.id)}
            style={[
              styles.tarjeta,
              servicioId === servicio.id && styles.tarjetaSeleccionada,
            ]}
          >
            <View style={styles.fila}>
              <Text style={styles.nombre}>{servicio.nombre}</Text>
              <Text style={styles.precio}>RD$ {servicio.precio}</Text>
            </View>

            <Text style={styles.detalle}>
              Duracion: {servicio.duracion} minutos
            </Text>

            {servicio.descripcion ? (
              <Text style={styles.detalle}>{servicio.descripcion}</Text>
            ) : null}

            {servicioId === servicio.id && (
              <Text style={styles.seleccionado}>Servicio seleccionado ✓</Text>
            )}
          </Pressable>
        ))
      )}

      <Text style={styles.etiqueta}>Fecha</Text>
      <TextInput
        style={styles.input}
        placeholder="AAAA-MM-DD"
        value={fecha}
        onChangeText={setFecha}
        editable={!guardando}
        autoCapitalize="none"
      />


      <Text style={styles.etiqueta}>Hora</Text>
      <TextInput
        style={styles.input}
        placeholder="HH:mm"
        value={hora}
        onChangeText={setHora}
        editable={!guardando}
        keyboardType="numbers-and-punctuation"
        maxLength={5}
      />


      <Pressable
        style={[
          styles.boton,
          (guardando || servicios.length === 0) && styles.botonDeshabilitado,
        ]}
        onPress={handleCrearReserva}
        disabled={guardando || servicios.length === 0}
      >
        {guardando ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.textoBoton}>Confirmar reserva</Text>
        )}
      </Pressable>

      <Pressable
        style={styles.botonVolver}
        onPress={() => router.back()}
        disabled={guardando}
      >
        <Text style={styles.textoVolver}>Volver</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: "#F8F5EF",
  },
  centrado: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#F8F5EF",
  },
  titulo: {
    color: "#28231F",
    fontSize: 28,
    fontWeight: "800",
  },
  descripcion: {
    color: "#766A60",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 26,
  },
  etiqueta: {
    color: "#28231F",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 18,
    marginBottom: 10,
  },
  tarjeta: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEE5DA",
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
  },
  tarjetaSeleccionada: {
    borderColor: "#75452F",
    borderWidth: 2,
  },
  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  nombre: {
    flex: 1,
    color: "#28231F",
    fontSize: 15,
    fontWeight: "800",
  },
  precio: {
    color: "#75452F",
    fontWeight: "800",
  },
  detalle: {
    color: "#766A60",
    fontSize: 13,
    marginTop: 7,
  },
  seleccionado: {
    color: "#75452F",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5D6C7",
    borderRadius: 13,
    padding: 14,
    fontSize: 15,
  },
  ayuda: {
    color: "#88796D",
    fontSize: 12,
    marginTop: 6,
  },
  aviso: {
    color: "#766A60",
    paddingVertical: 12,
  },
  boton: {
    backgroundColor: "#75452F",
    borderRadius: 15,
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  textoBoton: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  botonVolver: {
    alignItems: "center",
    padding: 16,
    marginTop: 4,
  },
  textoVolver: {
    color: "#75452F",
    fontWeight: "700",
  },
})
