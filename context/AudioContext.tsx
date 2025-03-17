import React, { createContext, useContext, useState } from 'react';
import { Audio } from 'expo-av';

type AudioContextType = {
  sound: Audio.Sound | null;
  playSound: (uri: string) => Promise<void>;
  stopSound: () => Promise<void>;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const playSound = async (uri: string) => {
    // Arrêter et libérer l'ancien son s'il y en a un
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }

    // Charger et jouer le nouveau son
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true }
    );
    setSound(newSound);
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  };

  return (
    <AudioContext.Provider value={{ sound, playSound, stopSound }}>
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
