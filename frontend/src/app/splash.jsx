import { useEffect, useRef } from "react";
import { View, Image, StyleSheet, Animated, StatusBar } from "react-native";

export default function Splash({ onFinish }) {
  const opacidad = useRef(new Animated.Value(0)).current;
  const escala = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacidad, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(escala, {
        toValue: 1,
        friction: 5,
        tension: 45,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setTimeout(() => {
          onFinish?.();
        }, 3000);
      }
    });
  }, [opacidad, escala]);

  return (
    <View style={styles.contenedor}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F3ED" />

      <Animated.View
        style={[
          styles.robotContenedor,
          {
            opacity: opacidad,
            transform: [{ scale: escala }],
          },
        ]}
      >
        <Image
          source={require("../../assets/images/robot.jpg")}
          style={styles.robot}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#F8F3ED",
    alignItems: "center",
    justifyContent: "center",
  },
  robotContenedor: {
    width: 260,
    height: 360,
    alignItems: "center",
    justifyContent: "center",
  },
  robot: {
    width: "100%",
    height: "100%",
  },
});
