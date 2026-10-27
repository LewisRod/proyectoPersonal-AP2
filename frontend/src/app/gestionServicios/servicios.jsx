import { useEffect, useState } from "react"
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, Button } from "react-native"
import { router } from "expo-router"
import { listarServicios, eliminarServicio } from "../../serviciosBackend/serviciosServices.js";
import { obtenerUsuario,eliminarToken} from "../../serviciosBackend/authStorage.js";


export default function Servicios() {
  const [servicios, setServicios] = useState([])
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")
  
  useEffect(() => {
    cargarDatos()
  }, [])
  
  const handleEliminarServicio = (servicio) => {
    Alert.alert(
      "eliminar servicio",
      `seguro que deseas eliminar "${servicio.nombre}"`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await eliminarServicio(servicio.id);
  
              setServicios((serviciosActuales) =>
                serviciosActuales.filter((item) => item.id !== servicio.id),
              )
  
              Alert.alert(
                "servicio eliminado",
                "el servicio se elimino correctamente",
              )
            } catch (error) {
              "no se pudo eliminar el servicio"
              Alert.alert( "Error", error.message || "no se pudo eliminar")
            }
          }
        }
      ]
    )
  }


  const cargarDatos = async () => {
    try {
      setCargando(true)
      setError("")

      const usuarioGuardado = await obtenerUsuario()
      setUsuario(usuarioGuardado)

     
      const datos = await listarServicios()
      setServicios(datos);
    } catch (error) {
     "no se cargaron los servicios"
    } finally {
      setCargando(false)
    }
  }

  const cerrarSesion = () => {
    Alert.alert("cerrar sesion","seguro de cerrar sesion?", [
      {
        text: "Cancelar", style: "cancel"
      },
      {
        text: "cerrar sesion", style: "destructive",
        onPress: async () => {
          await eliminarToken();
          router.replace("/auth/login")
        },
      },
    ])
  }

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" />
        <Text>Cargando servicios...</Text>
      </View>
    );
  }
  

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Servicios disponibles</Text>

      {usuario && (
        <Text style={styles.usuario}>
          Hola {usuario.nombre} | Rol: {usuario.rol}
        </Text>
      )}

      {error ? (
        <View>
          <Text style={styles.error}>{error}</Text>
          <Button title="Reintentar" onPress={cargarDatos} />
        </View>
      ) : (
        <FlatList
          data={servicios}
          keyExtractor={(item) => String(item.id)}
          onRefresh={cargarDatos}
          refreshing={cargando}
          ListEmptyComponent={
            <Text style={styles.vacio}>No hay servicios disponibles.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.tarjeta}>
              <Text style={styles.nombre}>{item.nombre}</Text>

              <Text>Duracion: {item.duracion} minutos</Text>

              <Text>Precio: RD$ {item.precio}</Text>

              {item.descripcion ? <Text>{item.descripcion}</Text> : null}

              {usuario?.rol !== "admin" && (
                <Button
                  title="Reservar este servicio"
                  color="#75452F"
                  onPress={() =>
                    router.push({
                      pathname: "/reservas/crearReserva",
                      params: { servicioId: String(item.id) },
                    })
                  }
                />
              )}

              {usuario?.rol === "admin" && (
                <View style={styles.acciones}>
                  <Button
                    title="Editar"
                    color="#2f74ea"
                    onPress={() =>
                      router.push({
                        pathname: "/gestionServicios/editarServicio",
                        params: { id: String(item.id) },
                      })
                    }
                  />

                  <Button
                    title="Eliminar"
                    color="#d32f2f"
                    onPress={() => handleEliminarServicio(item)}
                  />
                </View>
              )}
            </View>
          )}
        />
      )}

      {usuario?.rol === "admin" && (
        <View style={styles.botonAdmin}>
          <Button
            title="Crear servicio"
            onPress={() => router.push("/gestionServicios/crearServicios")}
          />
        </View>
      )}

      <View style={styles.botonCerrar}>
        <Button title="cerrar sesion" onPress={cerrarSesion} />
        <Button
          title="volver a home"
          onPress={() => router.back("/gestionServicios")}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F5EF",
  },

  contenedor: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 65,
    backgroundColor: "#FFF9F0",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },


  titulo: {
    color: "#28231F",
    fontSize: 29,
    fontWeight: "800",
    letterSpacing: -1,
  },

  descripcionGeneral: {
    color: "#88796D",
    fontSize: 14,
    marginTop: 8,
    lineHeight: 21,
  },


  textoCrear: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  descripcionCrear: {
    color: "#F0DDD0",
    fontSize: 12,
    marginTop: 4,
  },

 
  lista: {
    paddingBottom: 28,
    flexGrow: 1,
  },

  listaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  listaTitulo: {
    color: "#28231F",
    fontSize: 19,
    fontWeight: "800",
  },

  contador: {
    color: "#88796D",
    fontSize: 12,
    fontWeight: "600",
  },

  tarjeta: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#EEE5DA",
    borderRadius: 19,
    marginTop:15
  },

  tarjetaHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  nombre: {
    color: "#28231F",
    fontSize: 15,
    fontWeight: "800",
  },

  duracion: {
    color: "#88796D",
    fontSize: 12,
    marginTop: 5,
  },

  precioContainer: {
    alignItems: "flex-end",
  },

  precioLabel: {
    color: "#A3988D",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 4,
  },

  precio: {
    color: "#75452F",
    fontSize: 15,
    fontWeight: "800",
  },

  descripcion: {
    color: "#766A60",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 14,
  }
})
