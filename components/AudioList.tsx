import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Audio } from "expo-av";

const AudioList = () => {
  const [audioFiles, setAudioFiles] = useState<MediaLibrary.Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") return setLoading(false);
      let files: MediaLibrary.Asset[] = [], cursor = null;
      while (true) {
        const { assets, hasNextPage, endCursor } = await MediaLibrary.getAssetsAsync({ mediaType: "audio", first: 100, after: cursor||undefined });
        files = [...files, ...assets];
        if (!hasNextPage) break;
        cursor = endCursor;
      }
      setAudioFiles(files);
      setLoading(false);
    })();
  }, []);

  const playAudio = async (uri: string) => {
    if (sound) await sound.unloadAsync();
    const { sound: newSound } = await Audio.Sound.createAsync({ uri });
    setSound(newSound);
    await newSound.playAsync();
  };

  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>🎵 Liste des musiques</Text>
      {loading ? <ActivityIndicator size="large" color="blue" /> : (
        <FlatList
          data={audioFiles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => playAudio(item.uri)} style={{ padding: 10, borderBottomWidth: 1 }}>
              <Text>{item.filename || "Fichier audio"}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default AudioList;
