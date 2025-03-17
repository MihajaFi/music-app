import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, Dimensions } from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

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

export function PlayerControls({
  sound,
  isPlaying,
  pauseSound,
  playSound,
  nextTrack,
  previousTrack,
  currentSongUri,
}: Props) {
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);

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
    </View>
  );
}
