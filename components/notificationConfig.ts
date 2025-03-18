import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { Platform } from 'react-native';

const NotificationConfig: React.FC = () => {
  useEffect(() => {
    // Demande de permissions
    const requestPermissions = async () => {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (status !== 'granted') {
        console.error('Permission for notifications not granted!');
      }
    };

    // Configuration des notifications
    const configureNotifications = async () => {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
          lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        });
      }

      // Configuration du gestionnaire de notifications
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
    };

    // Fonction pour envoyer une notification persistante
    const schedulePersistentNotification = async () => {
      // Configuration de la notification persistante qui reste active
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Application en cours',
          body: 'L’application fonctionne en arrière-plan.',
          sound: 'default',
          sticky: true, // Reste visible jusqu’à ce que l’utilisateur l’interagisse
        },
        trigger: {
          seconds: 1, // Redemander la notification toutes les secondes pour la rendre persistante
          repeats: true, // Répéter la notification
        } as Notifications.TimeIntervalTriggerInput, // Casting explicite
      });
    };

    // Demande de permission et configuration
    requestPermissions();
    configureNotifications();

    // Planification de la notification persistante
    schedulePersistentNotification();
  }, []);

  return null;
};

export default NotificationConfig;
