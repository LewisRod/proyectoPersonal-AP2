import { useCallback, useState } from "react"
import { View,  Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Alert,RefreshControl } from "react-native"
import { useFocusEffect, router } from "expo-router"
import { listarReservas, cambiarEstadoReserva } from "../../serviciosBackend/reservasServices.js"

export default function GestionarReservas() {
  const [reservas, setReservas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [actualizando, setActualizando] = useState(false)
  const [procesandoId, setProcesandoId] = useState(null)
  const [filtro, setFiltro] = useState("todas")
  const [error, setError] = useState("")

  const cargarReservas = useCallback(async (refrescar = false) => {
    if (refrescar) {
      setActualizando(true)
    } else {
      setCargando(true)
    }

    setError("")

    try {
      const datos = await listarReservas()
      setReservas(Array.isArray(datos) ? datos : [])
    } catch (err) {
      console.error("error cargando reservas:", err)
      setError("no se pudieron cargar ls reservas")
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

  const actualizarEstado = (reserva, nuevoEstado) => {
    const accion = nuevoEstado === "completada" ? "marcar como completada" : "cancelar"

    Alert.alert(
      "Confirmar",
      `deseas ${accion} la reserva #${reserva.id}?`,
      [
        { text: "Volver", style: "cancel" },
        {
          text: "Confirmar", style: nuevoEstado === "cancelada" ? "destructive" : "default",
          onPress: () => ejecutarCambioEstado(reserva.id, nuevoEstado),
        }
      ]
    )
  }

  const ejecutarCambioEstado = async (id, estado) => {
    try {
      setProcesandoId(id);

      await cambiarEstadoReserva(id, estado)
      await cargarReservas(true)

      Alert.alert(
        "Reserva actualizada",
        estado === "completada"
          ? "La reserva se marco completada."
          : "La reserva fue cancelada",
      )
    } catch (err) {
      console.error("error al actualizar reserva:", err)

      const mensaje = err.response?.data?.mensaje || "no se pudo actualizar la reserva"

      Alert.alert("Error", mensaje)
    } finally {
      setProcesandoId(null)
    }
  }

  const formatearFecha = (fecha) => {
    const valor = new Date(fecha)

    if (Number.isNaN(valor.getTime())) {
      return "Fecha no disponible";
    }

    return valor.toLocaleDateString("es-DO", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    })
  }

  const reservasFiltradas =
    filtro === "todas" ? reservas : reservas.filter((reserva) => reserva.estado === filtro)

  const pendientes = reservas.filter(
    (reserva) => reserva.estado === "pendiente",
  ).length

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#75452F" />
        <Text style={styles.textoSecundario}>Cargando reservas...</Text>
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

      <Text style={styles.titulo}>Gestionar reservas</Text>
      <Text style={styles.descripcion}>
        consulta las reservas de los clientes y maneja su estado
      </Text>

      <View style={styles.resumen}>
        <View style={styles.resumenItem}>
          <Text style={styles.numeroResumen}>{reservas.length}</Text>
          <Text style={styles.etiquetaResumen}>Total</Text>
        </View>

        <View style={styles.separadorResumen} />

        <View style={styles.resumenItem}>
          <Text style={styles.numeroResumen}>{pendientes}</Text>
          <Text style={styles.etiquetaResumen}>Pendientes</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtros}
      >
        {[
          { valor: "todas", texto: "Todas" },
          { valor: "pendiente", texto: "Pendientes" },
          { valor: "completada", texto: "Completadas" },
          { valor: "cancelada", texto: "Canceladas" },
        ].map((opcion) => (
          <Pressable
            key={opcion.valor}
            style={[
              styles.filtro,
              filtro === opcion.valor && styles.filtroActivo,
            ]}
            onPress={() => setFiltro(opcion.valor)}
          >
            <Text
              style={[
                styles.textoFiltro,
                filtro === opcion.valor && styles.textoFiltroActivo,
              ]}
            >
              {opcion.texto}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {error ? (
        <View style={styles.mensajeError}>
          <Text style={styles.textoError}>{error}</Text>
          <Pressable
            style={styles.botonPrincipal}
            onPress={() => cargarReservas()}
          >
            <Text style={styles.textoBoton}>Reintentar</Text>
          </Pressable>
        </View>
      ) : reservasFiltradas.length === 0 ? (
        <View style={styles.vacio}>
          <Text style={styles.tituloVacio}>
            No hay reservas en esta categoría
          </Text>
          <Text style={styles.textoSecundario}>
            Prueba otro filtro o actualiza la lista.
          </Text>
        </View>
      ) : (
        reservasFiltradas.map((reserva) => (
          <View key={reserva.id} style={styles.tarjeta}>
            <View style={styles.filaSuperior}>
              <Text style={styles.idReserva}>Reserva #{reserva.id}</Text>

              <View
                style={[
                  styles.estado,
                  reserva.estado === "pendiente" && styles.estadoPendiente,
                  reserva.estado === "completada" && styles.estadoCompletada,
                  reserva.estado === "cancelada" && styles.estadoCancelada,
                ]}
              >
                <Text style={styles.textoEstado}>
                  {reserva.estado === "pendiente"
                    ? "Pendiente"
                    : reserva.estado === "completada"
                      ? "Completada"
                      : reserva.estado === "cancelada"
                        ? "Cancelada"
                        : reserva.estado}
                </Text>
              </View>
            </View>

            <Text style={styles.nombreServicio}>
              {reserva.servicio?.nombre || "Servicio"}
            </Text>

            <Text style={styles.precio}>
              RD$ {reserva.servicio?.precio ?? "—"}
            </Text>

            {!!reserva.servicio?.descripcion && (
              <Text style={styles.detalle}>{reserva.servicio.descripcion}</Text>
            )}

            <View style={styles.separador} />

            <Text style={styles.subtitulo}>Datos del cliente</Text>
            <Text style={styles.dato}>
              Nombre: {reserva.usuario?.nombre || "No disponible"}
            </Text>
            <Text style={styles.dato}>
              Correo: {reserva.usuario?.email || "No disponible"}
            </Text>
            <Text style={styles.dato}>ID de cliente: {reserva.usuarioId}</Text>

            <View style={styles.separador} />

            <Text style={styles.subtitulo}>Fecha y horario</Text>
            <Text style={styles.dato}>
              Fecha: {formatearFecha(reserva.fecha)}
            </Text>
            <Text style={styles.dato}>Hora: {reserva.hora}</Text>
            <Text style={styles.dato}>
              Duración: {reserva.servicio?.duracion ?? "—"} minutos
            </Text>

            {reserva.estado === "pendiente" && (
              <View style={styles.acciones}>
                <Pressable
                  style={[
                    styles.botonCompletar,
                    procesandoId === reserva.id && styles.deshabilitado,
                  ]}
                  disabled={procesandoId === reserva.id}
                  onPress={() => actualizarEstado(reserva, "completada")}
                >
                  {procesandoId === reserva.id ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.textoBoton}>Marcar completada</Text>
                  )}
                </Pressable>

                <Pressable
                  style={[
                    styles.botonCancelar,
                    procesandoId === reserva.id && styles.deshabilitado,
                  ]}
                  disabled={procesandoId === reserva.id}
                  onPress={() => actualizarEstado(reserva, "cancelada")}
                >
                  <Text style={styles.textoCancelar}>Cancelar reserva</Text>
                </Pressable>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
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
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#30231D",
    marginBottom: 8,
  },
  descripcion: {
    color: "#756A64",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  botonVolver: {
    alignSelf: "flex-start",
    marginBottom: 22,
  },
  textoVolver: {
    color: "#75452F",
    fontSize: 16,
    fontWeight: "600",
  },
  resumen: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E9E0DA",
  },
  resumenItem: {
    flex: 1,
    alignItems: "center",
    gap: 5,
  },
  numeroResumen: {
    color: "#75452F",
    fontSize: 27,
    fontWeight: "bold",
  },
  etiquetaResumen: {
    color: "#756A64",
    fontSize: 13,
  },
  separadorResumen: {
    width: 1,
    height: 40,
    backgroundColor: "#E9E0DA",
  },
  filtros: {
    gap: 8,
    paddingBottom: 18,
  },
  filtro: {
    borderWidth: 1,
    borderColor: "#DCCFC6",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
  },
  filtroActivo: {
    backgroundColor: "#75452F",
    borderColor: "#75452F",
  },
  textoFiltro: {
    color: "#75452F",
    fontSize: 13,
    fontWeight: "600",
  },
  textoFiltroActivo: {
    color: "#FFFFFF",
  },
  tarjeta: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 17,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E9E0DA",
  },
  filaSuperior: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 12,
  },
  idReserva: {
    color: "#756A64",
    fontSize: 13,
    fontWeight: "600",
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
    color: "#30231D",
    fontSize: 12,
    fontWeight: "bold",
  },
  nombreServicio: {
    color: "#30231D",
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 5,
  },
  precio: {
    color: "#75452F",
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detalle: {
    color: "#756A64",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 8,
  },
  separador: {
    height: 1,
    backgroundColor: "#EEE7E2",
    marginVertical: 12,
  },
  subtitulo: {
    color: "#30231D",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dato: {
    color: "#756A64",
    fontSize: 14,
    lineHeight: 22,
  },
  acciones: {
    gap: 10,
    marginTop: 18,
  },
  botonCompletar: {
    minHeight: 46,
    backgroundColor: "#75452F",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  botonCancelar: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: "#D9A5A0",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  textoBoton: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  textoCancelar: {
    color: "#B42318",
    fontSize: 14,
    fontWeight: "bold",
  },
  deshabilitado: {
    opacity: 0.6,
  },
  vacio: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 22,
    alignItems: "center",
  },
  tituloVacio: {
    color: "#30231D",
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  textoSecundario: {
    color: "#756A64",
    fontSize: 14,
    textAlign: "center",
  },
  mensajeError: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E9C3BF",
    gap: 12,
  },
  textoError: {
    color: "#B42318",
    fontSize: 14,
  },
  botonPrincipal: {
    backgroundColor: "#75452F",
    minHeight: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
});
