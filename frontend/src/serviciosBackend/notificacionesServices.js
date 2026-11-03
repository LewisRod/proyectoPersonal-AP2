import * as Notifications from "expo-notifications";
import { scheduleNotificationAsync } from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NOTIFICACIONES_KEY = "notificacionesReservas";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const solicitudPermisos = async () => {
  const { granted } = await Notifications.requestPermissionsAsync();

  if (!granted) {
    console.log("permiso denegado para notificaciones");
  }

  return granted;
};

export const programarNotificacionReserva = async (reserva) => {
  try {
    const fechaReserva = new Date(
      `${reserva.fecha.split("T")[0]}T${reserva.hora}:00`,
    );

    const fechaNotificacion = new Date(
      fechaReserva.getTime() - 24 * 60 * 60 * 1000, //getTime da la fecha en milisegundo y por eso se resta por esa multiplicacion  24h, 60min,60seg y 1000mil
    );

    if (fechaNotificacion <= new Date()) {//para verificar que la fecha siga siendo futura
      return null
    }
    const notificacionId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Recuerda tu reserva pendiente",
        body: `tienes una reserva para ${reserva.servicio.nombre} mañana`,
        data: { reservaId: reserva.id },
      },
      trigger: {type: Notifications.SchedulableTriggerInputTypes.DATE, date: fechaNotificacion }
    })

    await guardarNotificacionReserva(reserva.id, notificacionId);

    return notificacionId;
  } catch (error) {
    console.log("error con la notificacion:", error);
    return null;
  }
};

export const cancelarNotificacionReserva = async (reservaId) => {
  try {
   
    const notificacionId = await obtenerNotificacionReserva(reservaId);

    if (!notificacionId) return;

    await Notifications.cancelScheduledNotificationAsync(notificacionId);

    const datos = await AsyncStorage.getItem(NOTIFICACIONES_KEY);

    const notificaciones = datos ? JSON.parse(datos) : {};

    delete notificaciones[reservaId];

    await AsyncStorage.setItem(
      NOTIFICACIONES_KEY,
      JSON.stringify(notificaciones),
    );
  } catch (error) {
    console.log("error en la cancelancion de notificacion:", error)
  }
};

const obtenerNotificacionReserva = async (reservaId) => {
  const datos = await AsyncStorage.getItem(NOTIFICACIONES_KEY);

  const notificaciones = datos ? JSON.parse(datos) : {};

  return notificaciones[reservaId] || null;
};

const guardarNotificacionReserva = async (reservaId, notificacionId) => {
  const datos = await AsyncStorage.getItem(NOTIFICACIONES_KEY);

  const notificaciones = datos ? JSON.parse(datos) : {};

  notificaciones[reservaId] = notificacionId;

  await AsyncStorage.setItem(
    NOTIFICACIONES_KEY,
    JSON.stringify(notificaciones),
  );
};

