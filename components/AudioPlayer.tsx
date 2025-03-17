import React from 'react';
import { View } from 'react-native';
import { Audio } from 'expo-av';
import { PlayerControls } from '../components';
import { useAudio } from '../context';

type Props = {
  sound: Audio.Sound | null;
  currentSongUri: string;  // Get the current URI here
};

export function AudioPlayer({ sound, currentSongUri }: Props) {
  const { isPlaying, pauseSound, playSound, nextTrack, previousTrack } = useAudio();

  return (
    <View>
      <PlayerControls
        sound={sound}
        isPlaying={isPlaying}
        pauseSound={pauseSound}
        playSound={playSound}
        nextTrack={nextTrack}
        previousTrack={previousTrack}
        currentSongUri={currentSongUri}  // Pass the URI to PlayerControls
      />
    </View>
  );
}
