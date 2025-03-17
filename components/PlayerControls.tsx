import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, Dimensions } from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import Slider from '@react-native-community/slider';  // Assure-toi d'importer Slider correctement

const { width } = Dimensions.get('window'); // Utilise la largeur de l'écran

type Props = {
  sound: Audio.Sound | null;
  isPlaying: boolean;
  pauseSound: () => Promise<void>;
  playSound: (uri: string) => Promise<void>;
  nextTrack: () => void;
  previousTrack: () => void;
  currentSongUri: string;
};

export function PlayerControls({
  sound,
  isPlaying,
  pauseSound,
  playSound,
  nextTrack,
  previousTrack,
  currentSongUri,
}: Props) {
  const [position, setPosition] = useState(0); // Position en millisecondes
  const [duration, setDuration] = useState(0); // Durée totale de la chanson en millisecondes

  // Met à jour la position et la durée de la chanson
  useEffect(() => {
    if (sound) {
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPosition(status.positionMillis || 0);
          setDuration(status.durationMillis || 0);
        }
        if (status.didJustFinish) {
          nextTrack(); // Passer à la chanson suivante quand la lecture est terminée
        }
      });
    }
  }, [sound]);

  // Fonction de formatage de temps
  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  // Calcul de la valeur pour le slider
  const calculateSliderValue = () => {
    if (duration === 0) return 0;
    return position / duration;
  };

  // Mise à jour de la position du son en fonction du slider
  const onSliderValueChange = (value: number) => {
    if (sound) {
      const newPosition = value * duration;
      setPosition(newPosition); // Mettre à jour la position localement
    }
  };

  // Mise à jour de la position après avoir déplacé le slider
  const onSliderSlidingComplete = async (value: number) => {
    if (sound) {
      const newPosition = value * duration;
      await sound.setPositionAsync(newPosition); // Déplacer la position audio
      if (isPlaying) {
        await sound.playAsync(); // Reprendre la lecture si elle est en cours
      }
    }
  };

  // Met à jour la position du slider pendant la lecture
  useEffect(() => {
    const interval = setInterval(() => {
      if (sound && isPlaying) {
        sound.getStatusAsync().then((status) => {
          if (status.isLoaded) {
            setPosition(status.positionMillis || 0);
          }
        });
      }
    }, 1000); // Met à jour chaque seconde (ou intervalle plus petit si nécessaire)

    return () => clearInterval(interval); // Clean up interval when component is unmounted
  }, [isPlaying, sound]);

  return (
    <View style={{ flexDirection: "column", alignItems: "center", marginTop: 30 }}>
      {/* Bouton Précédent */}
      <TouchableOpacity style={{ marginHorizontal: 20 }}>
        <Ionicons
          name="play-skip-back-outline"
          onPress={previousTrack}
          size={40}
          color={"white"}
          backgroundColor="transparent"
        />
      </TouchableOpacity>

      {/* Toggle Play/Pause */}
      <TouchableOpacity
        style={{ backgroundColor: "#1DB954", padding: 20, borderRadius: 50 }}
        onPress={isPlaying ? pauseSound : () => playSound(currentSongUri)}
      >
        <Ionicons
          name={isPlaying ? "pause" : "play"}
          size={40}
          color="white"
        />
      </TouchableOpacity>

      {/* Bouton Suivant */}
      <TouchableOpacity style={{ marginHorizontal: 20 }}>
        <Ionicons
          name="play-skip-forward-outline"
          onPress={nextTrack}
          size={40}
          color={"white"}
        />
      </TouchableOpacity>

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {/* Affichage du slider */}
        <Slider
          style={{ width: width - 40, height: 40 }} // Utilisation de la largeur de l'écran
          minimumValue={0}
          maximumValue={1}
          value={calculateSliderValue()} // Calcul de la valeur du slider en fonction de la position et de la durée
          minimumTrackTintColor="#1DB954"
          maximumTrackTintColor="#333"
          onValueChange={onSliderValueChange}
          onSlidingStart={async () => {
            if (!isPlaying) return;
            try {
              await pauseSound(); // Pause avant de faire glisser
            } catch (error) {
              console.log('Erreur lors de la pause:', error);
            }
          }}
          onSlidingComplete={onSliderSlidingComplete}
        />

        {/* Affichage d'un texte statique */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: "white" }}>Slider Statique</Text>
        </View>
      </View>

      {/* Affichage du temps */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", width: width - 40, marginTop: 10 }}>
        <Text style={{ color: "white" }}>
          {formatTime(position)} / {formatTime(duration)}
        </Text>
      </View>
    </View>
  );
}
