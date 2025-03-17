import React from 'react';
import { FlatList, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Song = {
  id: string;
  uri: string;
  filename: string;
};

type Props = {
  songs: Song[];
};

export function MusicList({ songs }: Props) {
  const navigation = useNavigation<NavigationProp>();

  return (
    <FlatList
      data={songs}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Player', { song: item })}>
          <Text>{item.filename}</Text>
        </TouchableOpacity>
      )}
    />
  );
}