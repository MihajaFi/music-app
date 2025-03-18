import React from 'react';

import { AppNavigator } from '../navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AudioProvider } from '../context';
import NotificationConfig from '@/components/notificationConfig';
export default function Index() {
  return (
    <AudioProvider>
    <SafeAreaProvider>
        <NotificationConfig />
        <AppNavigator />
    </SafeAreaProvider>
    </AudioProvider>
  );
}
