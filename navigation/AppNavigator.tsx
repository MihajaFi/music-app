import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen , PlayerScreen } from '../screens';
export type RootStackParamList = {
  Home: undefined;
  Player: { song: { id: string; uri: string; filename: string } };
};

const Stack = createStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Player" component={PlayerScreen} />
    </Stack.Navigator>
  );
}