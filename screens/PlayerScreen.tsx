import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import { AudioPlayer } from '../components';
import { useAudio } from '../context';

type PlayerScreenRouteProp = RouteProp<RootStackParamList, 'Player'>;

type Props = {
  route: PlayerScreenRouteProp;
};

export function PlayerScreen({ route }: Props) {
  const { song } = route.params;
  const { playSound, sound } = useAudio(); // Utiliser le contexte

  useEffect(() => {
    if (song) {
      playSound(song.uri);
    }
  }, [song]);

  return (
    <View>
      <Text>Now Playing: {song.filename}</Text>
      <AudioPlayer sound={sound} />
    </View>
  );
}
