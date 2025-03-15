import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";
import { useRoute } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';

const AudioPlayer = () => {
  const route = useRoute();
  const { uri, index } = route.params as { uri: string; index: number };

  const [audioFiles, setAudioFiles] = useState<MediaLibrary.Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(index);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [metadata, setMetadata] = useState({
    title: "Titre inconnu",
    artist: "Artiste inconnu",
    album: "Album inconnu",
    artwork: null as string | null,
  });

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") return setLoading(false);

      let files: MediaLibrary.Asset[] = [];
      let cursor = null;

      while (true) {
        const { assets, hasNextPage, endCursor } = await MediaLibrary.getAssetsAsync({
          mediaType: "audio",
          first: 100,
          after: cursor || undefined,
        });
        files = [...files, ...assets];
        if (!hasNextPage) break;
        cursor = endCursor;
      }

      setAudioFiles(files);
      setLoading(false);

      // Play the audio file immediately
      if (files.length > 0) {
        playAudio(index);
      }
    })();

    // Cleanup function to unload sound when component unmounts
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const playAudio = async (index: number) => {
    if (sound) {
      await sound.unloadAsync();
    }

    const uri = audioFiles[index].uri;
    const { sound: newSound } = await Audio.Sound.createAsync({ uri });
    setSound(newSound);
    setCurrentIndex(index);
    setIsPlaying(true);

    await newSound.playAsync();
    updateMetadata(audioFiles[index]);

    const status = await newSound.getStatusAsync();
    console.log("Status: ", status);
  };

  const togglePlayback = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    if (currentIndex < audioFiles.length - 1) {
      playAudio(currentIndex + 1);
    }
  };

  const previousTrack = () => {
    if (currentIndex > 0) {
      playAudio(currentIndex - 1);
    }
  };

  const updateMetadata = async (file: MediaLibrary.Asset) => {
    setMetadata({
      title: file.filename || "Titre inconnu",
      artist: "Artiste inconnu",
      album: "Album inconnu",
      artwork: file.uri || null,
    });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <View style={styles.playerContainer}>
          <View style={styles.artworkContainer}>
            {metadata.artwork ? (
              <Image source={{ uri: metadata.artwork }} style={styles.artwork} />
            ) : (
              <View style={styles.placeholderArtwork}>
                <MaterialIcons name="music-note" size={80} color="white" />
              </View>
            )}
          </View>
          <View style={styles.metadataContainer}>
            <MaterialIcons name="music-note" size={50} color="white" style={styles.icon} />
            <Text style={styles.title}>{metadata.title}</Text>
          </View>

          <Text style={styles.subtitle}>{metadata.artist} - {metadata.album}</Text>

          <View style={styles.controls}>
            <TouchableOpacity onPress={previousTrack} style={styles.controlButton}>
              <MaterialIcons name="skip-previous" size={40} color="white" />
            </TouchableOpacity>

            <TouchableOpacity onPress={togglePlayback} style={styles.controlButton}>
              <MaterialIcons name={isPlaying ? "pause" : "play-arrow"} size={40} color="white" />
            </TouchableOpacity>

            <TouchableOpacity onPress={nextTrack} style={styles.controlButton}>
              <MaterialIcons name="skip-next" size={40} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  playerContainer: {
    alignItems: "center",
  },
  artworkContainer: {
    position: "relative",
    marginBottom: 20,
  },
  artwork: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  placeholderArtwork: {
    width: 200,
    height: 200,
    borderRadius: 10,
    backgroundColor: "#444",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  metadataContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    marginBottom: 10,
    fontSize: 90,
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#BBBBBB",
    marginBottom: 20,
    textAlign: "center",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  controlButton: {
    marginHorizontal: 20,
    padding: 10,
  },
});

export default AudioPlayer;
