import React from 'react';

import { AppNavigator } from '../navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AudioProvider } from '../context';
export default function Index() {
  return (
    <AudioProvider>
    <SafeAreaProvider>
        <AppNavigator />
    </SafeAreaProvider>
    </AudioProvider>
  );
}
