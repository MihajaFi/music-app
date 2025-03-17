import React from 'react';
import { View } from 'react-native';
import { PlayerControls } from '../components';
import { Audio } from 'expo-av';

type Props = {
  sound: Audio.Sound | null;
};

export function AudioPlayer({ sound }: Props) {
  return (
    <View>
      <PlayerControls sound={sound} />
    </View>
  );
}