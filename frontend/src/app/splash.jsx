import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  StatusBar,
  Pressable,
} from "react-native";

const IMAGEN_CASITA = require("../../assets/images/rcasa.png");

export default function Splash({ onFinish }) {
  const opacidad = useRef(new Animated.Value(0)).current;
  const escala = useRef(new Animated.Value(0.92)).current;
  const movimientoY = useRef(new Animated.Value(35)).current;
  const progreso = useRef(new Animated.Value(0)).current;
  const opacidadMarca = useRef(new Animated.Value(0)).current;
  const opacidadBoton = useRef(new Animated.Value(1)).current;
  const movimientoMulti = useRef(new Animated.Value(-35)).current;
  const movimientoServicios = useRef(new Animated.Value(35)).current;
  const escalaMarca = useRef(new Animated.Value(0.85)).current;

  const [cargaCompleta, setCargaCompleta] = useState(false);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacidad, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(escala, {
          toValue: 1,
          friction: 7,
          tension: 45,
          useNativeDriver: true,
        }),
        Animated.spring(movimientoY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(opacidadMarca, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.spring(movimientoMulti, {
          toValue: 0,
          friction: 7,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.spring(movimientoServicios, {
          toValue: 0,
          friction: 7,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.spring(escalaMarca, {
          toValue: 1,
          friction: 7,
          tension: 50,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(progreso, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: false,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setCargaCompleta(true);
      }
    });
  }, [
    opacidad,
    escala,
    movimientoY,
    opacidadMarca,
    progreso,
    movimientoMulti,
    movimientoServicios,
    escalaMarca,
  ])

  useEffect(() => {
    if (!cargaCompleta) return;

    const animacionBoton = Animated.loop(
      Animated.sequence([
        Animated.timing(opacidadBoton, {
          toValue: 0.2,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacidadBoton, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );

    animacionBoton.start();

    return () => {
      animacionBoton.stop();
    };
  }, [cargaCompleta, opacidadBoton]);

  const anchoBarra = progreso.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.contenedor}>
      <StatusBar barStyle="dark-content" backgroundColor="#E6D7C7" />

      <Animated.View
        style={[
          styles.marca,
          {
            opacity: opacidadMarca,
            transform: [{ scale: escalaMarca }],
          },
        ]}
      >
        <Animated.Text
          style={[
            styles.marcaMulti,
            {
              transform: [{ translateX: movimientoMulti }],
            },
          ]}
        >
          Multi
        </Animated.Text>

        <Animated.Text
          style={[
            styles.marcaServicios,
            {
              transform: [{ translateX: movimientoServicios }],
            },
          ]}
        >
          Servicios
        </Animated.Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.escena,
          {
            opacity: opacidad,
            transform: [{ scale: escala }, { translateY: movimientoY }],
          },
        ]}
      >
        <Image
          source={IMAGEN_CASITA}
          style={styles.casita}
          resizeMode="contain"
        />
      </Animated.View>

      <View style={styles.pie}>
        <View style={styles.fondoBarra}>
          <Animated.View style={[styles.progreso, { width: anchoBarra }]} />
        </View>

        {cargaCompleta ? (
          <Animated.View
            style={[styles.botonContenedor, { opacity: opacidadBoton }]}
          >
            <Pressable
              accessibilityRole="button"
              onPress={onFinish}
              style={({ pressed }) => [
                styles.boton,
                pressed && styles.botonPresionado,
              ]}
            >
              <Text style={styles.textoBoton}>toca para continuar</Text>
            </Pressable>
          </Animated.View>
        ) : (
          <Text style={styles.textoCarga}>Preparando tu hogar...</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#e4d1bc",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 35,
  },

  marca: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  marcaMulti: {
    color: "#30251F",
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -1.5,
    fontFamily: "Plus Jakarta Sans",
  },

  marcaServicios: {
    color: "#A95732",
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -1.5,
    fontFamily: "Plus Jakarta Sans",
  },

  escena: {
    width: "100%",
    flex: 1,
    maxHeight: 440,
    alignItems: "center",
    justifyContent: "center",
  },

  casita: {
    width: "100%",
    height: "100%",
  },

  pie: {
    width: "100%",
    alignItems: "center",
    minHeight: 95,
    justifyContent: "center",
  },

  fondoBarra: {
    width: "76%",
    height: 7,
    borderRadius: 10,
    backgroundColor: "#F8F1E8",
    overflow: "hidden",
  },

  progreso: {
    height: "100%",
    borderRadius: 10,
    backgroundColor: "#A95732",
  },

  textoCarga: {
    marginTop: 14,
    color: "#806858",
    fontSize: 12,
    fontWeight: "500",
  },

  botonContenedor: {
    width: "100%",
    marginTop: 13,
  },

  boton: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  botonPresionado: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  textoBoton: {
    color: "#75452F",
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Plus Jakarta Sans",
  },
});
