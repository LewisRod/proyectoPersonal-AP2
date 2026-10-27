import { useEffect, useState } from "react"
import { View,Text, StyleSheet,Pressable, ActivityIndicator,Alert } from "react-native"
import { router } from "expo-router"
import { obtenerUsuario,eliminarToken} from "../../serviciosBackend/authStorage.js"



export default function HomeServicios() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarUsuario()
  }, [])

  const cargarUsuario = async () => {
    try {
      const usuarioGuardado = await obtenerUsuario()

      if (!usuarioGuardado) {
        router.replace("/auth/login")
        return
      }

      setUsuario(usuarioGuardado)
    } catch (error) {
      Alert.alert("error", "no se pudo cargar la info del usuario")
    } finally {
      setCargando(false);
    }
  }

  const cerrarSesion = () => {
    Alert.alert("cerrar sesion", "seguro de cerrar sesion?", [
      { text: "cancelar", style: "cancel" },
      { text: "cerrar sesion",style: "destructive",
        onPress: async () => {
          try {
            await eliminarToken()
            router.replace("/")
          } catch (error) {
            Alert.alert("no se pudo cerrar la sesion.");
          }
        }
      }
    ])
  }

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#75452F" />
        <Text style={styles.textoCarga}>Cargando dashboard...</Text>
      </View>
    );
  }

  const esAdmin = usuario?.rol === "admin"

  return (
    <View style={styles.contenedor}>
      <View style={styles.encabezado}>
        <Text style={styles.marca}>
          Multi<Text style={styles.acento}>Servicios</Text>
        </Text>

        <Text style={styles.etiqueta}>
          {esAdmin ? "Home para administradores" : " Home para clientes"}
        </Text>

        <Text style={styles.titulo}>
          klk {usuario?.nombre || "bienvenido"}
        </Text>

        <Text style={styles.descripcion}>
          {esAdmin
            ? "Administra los servicios de tu negocio"
            : "Encuentra los servicios que necesitas para casa"}
        </Text>
      </View>

      <View style={styles.seccion}>
        <Text style={styles.tituloSeccion}>Accesos rapidos</Text>

        <Pressable
          style={styles.tarjeta}
          onPress={() => router.push("/gestionServicios/servicios")}
        >
          <Text style={styles.icono}>▤</Text>
          <View style={styles.contenidoTarjeta}>
            <Text style={styles.tituloTarjeta}>
              {esAdmin ? "Gestionar servicios" : "Explorar servicios"}
            </Text>
            <Text style={styles.detalleTarjeta}>
              {esAdmin
                ? "Consultar, editar y eliminar servicios"
                : "Consulta servicios, precios y duracion"}
            </Text>
          </View>
          <Text style={styles.flecha}>›</Text>
        </Pressable>

        {esAdmin && (
          <Pressable
            style={styles.tarjeta}
            onPress={() => router.push("/gestionServicios/crearServicios")}
          >
            <Text style={styles.icono}>＋</Text>
            <View style={styles.contenidoTarjeta}>
              <Text style={styles.tituloTarjeta}>Crear servicio</Text>
              <Text style={styles.detalleTarjeta}>
                Agregar servicio al catalogo
              </Text>
            </View>
            <Text style={styles.flecha}>›</Text>
          </Pressable>
        )}

        <Pressable
          style={[styles.tarjeta, styles.tarjetaPendiente]}
          onPress={() =>
            router.push(
              esAdmin ? "/reservas/gestionarReservas" : "/reservas/misReservas",
            )
          }
        >
          <Text style={styles.icono}>▦</Text>

          <View style={styles.contenidoTarjeta}>
            <Text style={styles.tituloTarjeta}>
              {esAdmin ? "Gestionar reservas" : "Mis reservas"}
            </Text>

            <Text style={styles.detalleTarjeta}>
              {esAdmin
                ? "Consultar y gestionar las reservas"
                : "Consultar tus reservas"}
            </Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.pie}>
        <Text style={styles.rol}>
          Estas como : {esAdmin ? "Administrador" : "Cliente"}
        </Text>

        <Pressable style={styles.botonCerrar} onPress={cerrarSesion}>
          <Text style={styles.textoCerrar}>cerrar sesion</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#F8F5EF",
    paddingHorizontal: 22,
    paddingTop: 65,
    paddingBottom: 24,
  },
  centrado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F8F5EF",
  },
  textoCarga: {
    color: "#766A60",
  },
  encabezado: {
    marginBottom: 32,
  },
  marca: {
    fontSize: 23,
    fontWeight: "800",
    color: "#28231F",
    marginBottom: 25,
  },
  acento: {
    color: "#A55F3E",
  },
  etiqueta: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#A55F3E",
    marginBottom: 10,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "600",
    color: "#28231F",
    letterSpacing: -0.8,
  },
  descripcion: {
    color: "#766A60",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  seccion: {
    gap: 14,
  },
  tituloSeccion: {
    fontSize: 18,
    fontWeight: "800",
    color: "#28231F",
    marginBottom: 2,
  },
  tarjeta: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EEE5DA",
    padding: 17,
    gap: 13,
  },
  icono: {
    width: 43,
    height: 43,
    lineHeight: 43,
    textAlign: "center",
    overflow: "hidden",
    borderRadius: 13,
    backgroundColor: "#F0E8DD",
    color: "#75452F",
    fontSize: 25,
    fontWeight: "700",
  },
  contenidoTarjeta: {
    flex: 1,
    gap: 4,
  },
  tituloTarjeta: {
    color: "#28231F",
    fontSize: 15,
    fontWeight: "800",
  },
  detalleTarjeta: {
    color: "#766A60",
    fontSize: 12,
    lineHeight: 18,
  },
  flecha: {
    color: "#A55F3E",
    fontSize: 28,
  },
  tarjetaPendiente: {
    opacity: 0.85,
  },
  proximamente: {
    color: "#A55F3E",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 4,
  },
  pie: {
    marginTop: "auto",
    paddingTop: 20,
  },
  rol: {
    textAlign: "center",
    color: "#88796D",
    fontSize: 12,
    marginBottom: 14,
  },
  botonCerrar: {
    borderWidth: 1,
    borderColor: "#E5D6C7",
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: "center",
  },
  textoCerrar: {
    color: "#75452F",
    fontSize: 14,
    fontWeight: "700",
  },
});
