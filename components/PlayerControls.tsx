import React from 'react';
import { View, Button } from 'react-native';
import { Audio } from 'expo-av';

type Props = {
  sound: Audio.Sound | null;
};

export function PlayerControls({ sound }: Props) {
  return (
    <View>
      <Button title="Play" onPress={() => sound?.playAsync()} />
      <Button title="Pause" onPress={() => sound?.pauseAsync()} />
      <Button title="Stop" onPress={() => sound?.stopAsync()} />
    </View>
  );
}