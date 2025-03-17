import React from 'react';
import { View, Text } from 'react-native';
import { useAudioFiles } from '../hooks';
import { MusicList } from '../components';

export function HomeScreen() {
  const songs = useAudioFiles();

  return (
    <View >
      <MusicList songs={songs} />
    </View>
  );
}