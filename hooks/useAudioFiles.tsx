import { useState, useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';

type Song = {
  id: string;
  uri: string;
  filename: string;
};

export function useAudioFiles() {
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        const media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio' });
        setSongs(media.assets as Song[]);
      }
    })();
  }, []);

  return songs;
}