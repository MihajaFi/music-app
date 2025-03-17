import React, { createContext, useContext, useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { useAudioFiles } from '@/hooks'; 

type Song = {
  id: string;
  uri: string;
  filename: string;
};

type AudioContextType = {
  sound: Audio.Sound | null;
  currentTrackIndex: number;
  isPlaying: boolean; 
  playSound: (uri: string) => Promise<void>;
  stopSound: () => Promise<void>;
  pauseSound: () => Promise<void>;
  nextTrack: () => void;
  previousTrack: () => void;
  songs: Song[];
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const songs = useAudioFiles(); 

 
  const playSound = async (uri: string) => {
    if (sound) {
      // Si un son est déjà joué, arrête-le et libère les ressources
      await sound.stopAsync();
      await sound.unloadAsync();
    }

    // Crée un nouveau son et commence à le jouer
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true }
    );
    setSound(newSound);
    setIsPlaying(true);

    // Détection de la fin de la lecture de la chanson
    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        nextTrack(); // Passe à la chanson suivante lorsque celle-ci est terminée
      }
    });
  };

  // Fonction pour arrêter le son
  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
    setIsPlaying(false);
  };

  // Fonction pour mettre en pause le son
  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false); // L'état isPlaying est mis à jour à false lorsque la musique est en pause
    }
  };

  // Fonction pour passer à la chanson suivante
  const nextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % songs.length;
    setCurrentTrackIndex(nextIndex);
    const nextSong = songs[nextIndex];
    playSound(nextSong.uri); // Joue la chanson suivante
  };

  // Fonction pour revenir à la chanson précédente
  const previousTrack = () => {
    const prevIndex = (currentTrackIndex - 1 + songs.length) % songs.length;
    setCurrentTrackIndex(prevIndex);
    const prevSong = songs[prevIndex];
    playSound(prevSong.uri); // Joue la chanson précédente
  };

  // Remarque importante: vérifier si la musique est déjà en pause au moment du premier rendu
  useEffect(() => {
    if (sound) {
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isPlaying) {
          setIsPlaying(true);
        } else {
          setIsPlaying(false);
        }
      });
    }
  }, [sound]);

  return (
    <AudioContext.Provider
      value={{
        sound,
        currentTrackIndex,
        isPlaying,
        playSound,
        stopSound,
        pauseSound,
        nextTrack,
        previousTrack,
        songs,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
