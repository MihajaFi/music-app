import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Audio } from 'expo-av';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation'
import { AudioPlayer } from '../components';

type PlayerScreenRouteProp = RouteProp<RootStackParamList, 'Player'>;

type Props = {
  route: PlayerScreenRouteProp;
};

export function PlayerScreen({ route }: Props) {
  const { song } = route.params;
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    (async () => {
      if (song) {
        const { sound } = await Audio.Sound.createAsync(
          { uri: song.uri },
          { shouldPlay: true }
        );
        setSound(sound);
      }
    })();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [song]);

  return (
    <View>
      <Text>Now Playing: {song.filename}</Text>
      <AudioPlayer sound={sound} />
    </View>
  );
}
