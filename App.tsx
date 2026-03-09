import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import {
  registerForPushNotifications,
  setupNotificationChannels,
  addNotificationListeners,
} from './src/services/notifications';

function AppContent() {
  const { resolvedTheme, colors } = useTheme();
  const navigationRef = useRef<NavigationContainerRef<any>>(null);

  useEffect(() => {
    // Initialize notifications
    setupNotificationChannels();
    registerForPushNotifications().then(token => {
      if (token) console.log('Push token:', token);
      // TODO: Send token to backend POST /api/push/register
    });

    // Listen for notification taps (foreground + background)
    const cleanup = addNotificationListeners(
      // In-app notification received
      (notification) => {
        console.log('Notification received:', notification.request.content.title);
      },
      // User tapped a notification
      (response) => {
        const data = response.notification.request.content.data;
        // Navigate based on notification type
        if (data?.incidentId && navigationRef.current) {
          // TODO: Deep-link to incident detail when navigation is ready
          console.log('Navigate to incident:', data.incidentId);
        } else if (data?.deviceId && navigationRef.current) {
          console.log('Navigate to device:', data.deviceId);
        }
      }
    );

    return cleanup;
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, paddingTop: 2 }} edges={['top']}>
        <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
        <NavigationContainer ref={navigationRef}>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
