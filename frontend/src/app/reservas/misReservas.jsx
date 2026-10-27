import { useCallback, useState } from "react"
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Alert, RefreshControl } from "react-native"
import { useFocusEffect, router } from "expo-router"
import { listarMisReservas,  cancelarReserva } from "../../serviciosBackend/reservasServices.js"

export default function MisReservas() {
  const [reservas, setReservas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [actualizando, setActualizando] = useState(false)
  const [cancelandoId, setCancelandoId] = useState(null)
  const [error, setError] = useState("")

  const cargarReservas = useCallback(async (refrescar = false) => {
    if (refrescar) {
      setActualizando(true)
    } else {
      setCargando(true)
    }

    setError("")

    try {
      const datos = await listarMisReservas();
      setReservas(Array.isArray(datos) ? datos : [])
    } catch (err) {
      console.error("error cargando reservas:", err)
      setError("no se pudo cargar reservas, intente de nuevo")
    } finally {
      setCargando(false)
      setActualizando(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      cargarReservas()
    }, [cargarReservas]),
  )

  const confirmarCancelacion = (reserva) => {
    Alert.alert(
      "Cancelar reserva",
      `seguro de cancelar la reserva de ${reserva.servicio.nombre}?`,
      [
        {
          text: "Volver",
          style: "cancel",
        },
        {
          text: "Sí, cancelar",
          style: "destructive",
          onPress: () => ejecutarCancelacion(reserva.id),
        }
      ]
    )
  }

  const ejecutarCancelacion = async (id) => {
    try {
      setCancelandoId(id)

      await cancelarReserva(id)

      Alert.alert("Reserva cancelada");

      await cargarReservas(true);
    } catch (err) {
      console.error("error cancelando reserva:", err)
    } finally {
      setCancelandoId(null)
    }
  }

  const formatearFecha = (fecha) => {
    const fechaLocal = new Date(fecha);

    if (Number.isNaN(fechaLocal.getTime())) {
      return "Fecha no disponible";
    }

    return fechaLocal.toLocaleDateString("es-DO", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    })
  }

  const obtenerEstado = (estado) => {
    switch (estado) {
      case "pendiente":
        return "Pendiente"
      case "completada":
        return "Completada"
      case "cancelada":
        return "Cancelada"
      default:
        return estado
    }
  }

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#75452F" />
        <Text style={styles.textoCargando}>Cargando tus reservas...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.contenedor}
      refreshControl={
        <RefreshControl
          refreshing={actualizando}
          onRefresh={() => cargarReservas(true)}
          colors={["#75452F"]}
        />
      }
    >
      <Pressable style={styles.botonVolver} onPress={() => router.back()}>
        <Text style={styles.textoVolver}>‹ Volver</Text>
      </Pressable>

      <Text style={styles.titulo}>Mis reservas</Text>

      {error ? (
        <View style={styles.mensajeError}>
          <Text style={styles.textoError}>{error}</Text>

          <Pressable
            style={styles.botonReintentar}
            onPress={() => cargarReservas()}
          >
            <Text style={styles.textoBoton}>Reintentar</Text>
          </Pressable>
        </View>
      ) : reservas.length === 0 ? (
        <View style={styles.vacio}>
          <Text style={styles.iconoVacio}>▤</Text>
          <Text style={styles.tituloVacio}>sin rerservas</Text>
          <Text style={styles.descripcionVacio}>
             mira los servicios disponibles y reserva el que necesites
          </Text>

          <Pressable
            style={styles.botonPrincipal}
            onPress={() => router.replace("/gestionServicios/servicios")}
          >
            <Text style={styles.textoBoton}>busca servicios</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <Text style={styles.total}>
            {reservas.length}{" "}
            {reservas.length === 1
              ? "reserva registrada"
              : "reservas registradas"}
          </Text>

          {reservas.map((reserva) => (
            <View key={reserva.id} style={styles.tarjeta}>
              <View style={styles.encabezadoTarjeta}>
                <View style={styles.infoServicio}>
                  <Text style={styles.nombreServicio}>
                    {reserva.servicio?.nombre || "Servicio"}
                  </Text>

                  <Text style={styles.precio}>
                    RD$ {reserva.servicio?.precio ?? "—"}
                  </Text>
                </View>

                <View
                  style={[
                    styles.estado,
                    reserva.estado === "pendiente" && styles.estadoPendiente,
                    reserva.estado === "completada" && styles.estadoCompletada,
                    reserva.estado === "cancelada" && styles.estadoCancelada,
                  ]}
                >
                  <Text style={styles.textoEstado}>
                    {obtenerEstado(reserva.estado)}
                  </Text>
                </View>
              </View>

              {!!reserva.servicio?.descripcion && (
                <Text style={styles.detalle}>
                  {reserva.servicio.descripcion}
                </Text>
              )}

              <View style={styles.separador} />

              <View style={styles.dato}>
                <Text style={styles.etiqueta}>Fecha</Text>
                <Text style={styles.valor}>
                  {formatearFecha(reserva.fecha)}
                </Text>
              </View>

              <View style={styles.dato}>
                <Text style={styles.etiqueta}>Hora</Text>
                <Text style={styles.valor}>{reserva.hora}</Text>
              </View>

              <View style={styles.dato}>
                <Text style={styles.etiqueta}>Duracion</Text>
                <Text style={styles.valor}>
                  {reserva.servicio?.duracion ?? "—"} minutos
                </Text>
              </View>

              <Text style={styles.idReserva}>Reserva #{reserva.id}</Text>

              {reserva.estado === "pendiente" && (
                <Pressable
                  style={[
                    styles.botonCancelar,
                    cancelandoId === reserva.id && styles.botonDeshabilitado,
                  ]}
                  onPress={() => confirmarCancelacion(reserva)}
                  disabled={cancelandoId === reserva.id}
                >
                  {cancelandoId === reserva.id ? (
                    <ActivityIndicator color="#B42318" />
                  ) : (
                    <Text style={styles.textoCancelar}>Cancelar reserva</Text>
                  )}
                </Pressable>
              )}
            </View>
          ))}
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  contenedor: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 55,
    paddingBottom: 35,
    backgroundColor: "#F8F5F2",
  },
  centrado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F5F2",
    gap: 12,
  },
  textoCargando: {
    color: "#666",
    fontSize: 15,
  },
  botonVolver: {
    alignSelf: "flex-start",
    marginBottom: 22,
    paddingVertical: 5,
  },
  textoVolver: {
    color: "#75452F",
    fontSize: 16,
    fontWeight: "600",
  },
  titulo: {
    fontSize: 29,
    fontWeight: "bold",
    color: "#30231D",
    marginBottom: 8,
  },
  descripcion: {
    color: "#756A64",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  total: {
    color: "#756A64",
    fontSize: 14,
    marginBottom: 14,
  },
  tarjeta: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E9E0DA",
  },
  encabezadoTarjeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 12,
  },
  infoServicio: {
    flex: 1,
  },
  nombreServicio: {
    color: "#30231D",
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 6,
  },
  precio: {
    color: "#75452F",
    fontSize: 17,
    fontWeight: "bold",
  },
  estado: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  estadoPendiente: {
    backgroundColor: "#FFF0D5",
  },
  estadoCompletada: {
    backgroundColor: "#DDF5E5",
  },
  estadoCancelada: {
    backgroundColor: "#FCE5E3",
  },
  textoEstado: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#30231D",
  },
  detalle: {
    color: "#756A64",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 12,
  },
  separador: {
    height: 1,
    backgroundColor: "#EEE7E2",
    marginVertical: 5,
  },
  dato: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 9,
    gap: 12,
  },
  etiqueta: {
    color: "#756A64",
    fontSize: 14,
  },
  valor: {
    flex: 1,
    color: "#30231D",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
  },
  idReserva: {
    color: "#9A8D85",
    fontSize: 12,
    marginTop: 8,
    marginBottom: 14,
  },
  botonCancelar: {
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9A5A0",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  textoCancelar: {
    color: "#B42318",
    fontSize: 14,
    fontWeight: "bold",
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  vacio: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,
    marginTop: 12,
  },
  iconoVacio: {
    color: "#75452F",
    fontSize: 42,
    marginBottom: 12,
  },
  tituloVacio: {
    color: "#30231D",
    fontSize: 19,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  descripcionVacio: {
    color: "#756A64",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 20,
  },
  botonPrincipal: {
    width: "100%",
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: "#75452F",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  textoBoton: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  mensajeError: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E9C3BF",
  },
  textoError: {
    color: "#B42318",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 15,
  },
  botonReintentar: {
    backgroundColor: "#75452F",
    minHeight: 45,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
})
