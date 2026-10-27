import { View, Text, StyleSheet, Pressable, ImageBackground, SafeAreaView } from "react-native"
import { router } from "expo-router"
import { useState,useEffect } from "react";
import { obtenerToken, obtenerUsuario } from "../serviciosBackend/authStorage.js"
import { ActivityIndicator } from "react-native"


const SERVICIOS_IMAGEN = require("../../assets/images/rcasa.png");

export default function Index() {

  const [comprobandoSesion, setComprobandoSesion] = useState(true)
  
  useEffect(() => {
    const comprobarSesion = async () => {
      try {
        const token = await obtenerToken()
        const usuario = await obtenerUsuario()

        if (token && usuario) {
          router.replace("/gestionServicios")
        }
      } catch (error) {
        console.error("no se pudo comprobar la sesion:", error)
      } finally {
        setComprobandoSesion(false);
      }
    }

    comprobarSesion()
  }, [])

if (comprobandoSesion) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#75452F" />
    </View>
  );
}
  
  
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>
              Multi<Text style={styles.brandAccent}>Servicios</Text>
            </Text>
          </View>
        </View>

        <View style={styles.hero}>
          <ImageBackground
            source={SERVICIOS_IMAGEN}
            style={styles.heroImage}

            resizeMode="contain"
          >
            <View style={styles.imageBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.imageBadgeText}>Manten tu casa clean</Text>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>
            Registrate,{"\n"}
            <Text style={styles.titleAccent}> mira y gestiona servicios</Text>
          </Text>

          <Text style={styles.description}>
            Atiende las necesidades de todo tu hogar con nosotros
          </Text>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/auth/registro")}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>Crear mi cuenta</Text>
              <Text style={styles.buttonArrow}>↗</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/auth/login")}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.secondaryButtonText}>
                Ya tengo una cuenta
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F5EF",
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 12,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },

  logo: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#75452F",
    alignItems: "center",
    justifyContent: "center",
  },

  logoIcon: {
    color: "#FFF9F0",
    fontSize: 28,
    fontWeight: "bold",
  },

  brand: {
    color: "#28231F",
    fontSize: 23,
    fontWeight: "800",
    letterSpacing: -0.8,
  },

  brandAccent: {
    color: "#A55F3E",
  },

  brandSubtitle: {
    color: "#88796D",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginTop: 2,
  },

  hero: {
    height: "35%",
    minHeight: 210,
    maxHeight: 290,
    borderRadius: 24,
    backgroundColor: "#e4d1bd",
    shadowColor: "#60442E",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 5,
  },

  heroImage: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16,
  },

  heroImageRadius: {
    borderRadius: 24,
  },

  imageBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255, 250, 243, 0.94)",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 30,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#8A9A62",
  },

  imageBadgeText: {
    color: "#47372D",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },

  imageCaption: {
    backgroundColor: "rgba(36, 27, 21, 0.65)",
    padding: 14,
    borderRadius: 16,
    alignSelf: "flex-start",
  },

  imageCaptionTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 23,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 24,
  },

  eyebrow: {
    color: "#A55F3E",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 12,
  },

  title: {
    color: "#28231F",
    fontSize: 26,
    lineHeight: 41,
    fontWeight: "700",
    letterSpacing: -1.5,
  },

  titleAccent: {
    color: "#A55F3E",
  },

  description: {
    color: "#766A60",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 12,
    maxWidth: 320,
  },

  actions: {
    marginTop: 24,
    gap: 12,
  },

  primaryButton: {
    minHeight: 58,
    backgroundColor: "#75452F",
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  primaryButtonText: {
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

  secondaryButton: {
    minHeight: 54,
    backgroundColor: "#F0E8DD",
    borderWidth: 1,
    borderColor: "#E5D6C7",
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  secondaryButtonText: {
    color: "#75452F",
    fontSize: 15,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.985 }],
  },

  footer: {
    textAlign: "center",
    color: "#A3988D",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.4,
    marginTop: 20,
  },
});
