import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, Dimensions } from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack'; // Import StackNavigationProp
import { RootStackParamList } from '../navigation/AppNavigator'; // Import your RootStackParamList

const { width } = Dimensions.get("window");

type Props = {
  sound: Audio.Sound | null;
  isPlaying: boolean;
  pauseSound: () => Promise<void>;
  playSound: (uri: string) => Promise<void>;
  nextTrack: () => void;
  previousTrack: () => void;
  currentSongUri: string;
};

export const PlayerControls: React.FC<Props> = ({
  sound,
  isPlaying,
  pauseSound,
  playSound,
  nextTrack,
  previousTrack,
  currentSongUri,
}) => {
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);

  // Define the navigation type
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();

  // Configuration de l'audio en arrière-plan
  useEffect(() => {
    const configureAudioBackground = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,  // Permet de jouer l'audio en mode silencieux sur iOS
          allowsRecordingIOS: false,   // Désactive l'enregistrement
          staysActiveInBackground: true, // Maintient l'audio actif même en arrière-plan
        });
        console.log("Audio en arrière-plan activé");
      } catch (error) {
        console.log("Erreur lors de la configuration de l'audio en arrière-plan:", error);
      }
    };

    configureAudioBackground();

    return () => {
      if (sound) {
        sound.unloadAsync();  // Libère les ressources audio lorsque le composant est démonté
      }
    };
  }, [sound]);

  // Mise à jour du statut de la chanson (position et durée)
  useEffect(() => {
    if (sound) {
      const updateStatus = async () => {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          setDuration(status.durationMillis || 1);
          setPosition(status.positionMillis || 0);
        }
      };
      
      const interval = setInterval(updateStatus, 1000);
      return () => clearInterval(interval);
    }
  }, [sound]);

  const seekTo = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
      setPosition(value);
    }
  };

  const handlePlayPause = async () => {
    if (isPlaying) {
      await pauseSound();
    } else {
      if (sound) {
        await sound.playAsync();
      } else {
        await playSound(currentSongUri);
      }
    }
  };

  // Navigation to Home (or music list) screen
  const handleGoHome = () => {
    navigation.navigate("Home"); // Navigate to the Home screen (music list)
  };

  return (
    <View>
      <Slider
        style={{ width: width - 40, height: 40 }}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        onValueChange={setPosition}
        onSlidingComplete={seekTo}
      />
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 10 }}>
        <TouchableOpacity onPress={previousTrack} style={{ marginHorizontal: 20 }}>
          <Ionicons name="play-skip-back-outline" size={40} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: "#1DB954", padding: 20, borderRadius: 50 }}
          onPress={handlePlayPause}
        >
          <Ionicons name={isPlaying ? "pause" : "play"} size={40} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={nextTrack} style={{ marginHorizontal: 20 }}>
          <Ionicons name="play-skip-forward-outline" size={40} color="white" />
        </TouchableOpacity>
      </View>
      {/* Add button to navigate to Home (music list) */}
      <TouchableOpacity onPress={handleGoHome} style={{ marginTop: 20, alignItems: "center" }}>
        <Text style={{ color: "#1DB954", fontSize: 16 }}>Go to Music List</Text>
      </TouchableOpacity>
    </View>
  );
};
