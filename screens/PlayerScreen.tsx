import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import { useAudio } from '../context';
import { AudioPlayer } from '../components';
import { Ionicons } from '@expo/vector-icons';

type PlayerScreenRouteProp = RouteProp<RootStackParamList, 'Player'>;

type Props = {
  route: PlayerScreenRouteProp;
};

export function PlayerScreen({ route }: Props) {
  const { song } = route.params;
  const { playSound, sound, pauseSound, isPlaying, nextTrack, previousTrack, currentTrackIndex, songs } = useAudio();

  useEffect(() => {
    if (song) {
      playSound(song.uri);
    }
  }, [song]);

  const togglePlayback = () => {
    if (isPlaying) {
      pauseSound(); // Pause the sound if it is currently playing
    } else {
      playSound(song.uri); // Play the sound if it's not playing
    }
  };

  const currentSong = songs[currentTrackIndex]; // Utilisez l'index pour récupérer la chanson actuelle

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#232526' }}>
      {/* Image de l'album */}
      <View style={{ width: 250, height: 250, borderRadius: 20, backgroundColor: '#444', justifyContent: 'center', alignItems: 'center', marginBottom: 30 }}>
        <Ionicons name="musical-notes-outline" size={100} color="#fff" />
      </View>

      {/* Infos de la chanson */}
      <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>{currentSong.filename}</Text>
      <Text style={{ color: 'gray', fontSize: 18 }}>Unknown Artist</Text>

      {/* Pass currentSongUri to AudioPlayer */}
      <AudioPlayer sound={sound} currentSongUri={currentSong.uri} />
    </View>
  );
}
