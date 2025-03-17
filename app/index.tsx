import React from 'react';

import { AppNavigator } from '../navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
export default function Index() {
  return (
    <SafeAreaProvider>
        <AppNavigator />
    </SafeAreaProvider>
  );
}
