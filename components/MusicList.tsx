import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { styles } from '@/style/home.styles';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Song = {
  id: string;
  uri: string;
  filename: string;
  cover?: string;
  artist?: string;
  album?: string;
  format?: string;
  size?: string;
  filePath?: string;
};

type Props = {
  songs: Song[];
};

export function MusicList({ songs }: Props) {
  const navigation = useNavigation<NavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const handleShowMetadata = (item: Song) => {
    setSelectedSong(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedSong(null);
  };

  return (
    <>
      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('Player', { song: item })}
          >
            <MaterialIcons name="music-note" size={60} color="#FFF" style={styles.cover} />
            <View style={styles.info}>
              <Text style={styles.title}>{item.filename}</Text>
              <Text style={styles.artist}>{item.artist || 'Artist inconnu'}</Text>
            </View>

            <TouchableOpacity onPress={() => handleShowMetadata(item)}>
              <MaterialIcons name="more-vert" size={30} color="#FFF" style={{ marginLeft: 10 }} />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      {selectedSong && (
        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Détails</Text>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailsText}>Titre: {selectedSong.filename}</Text>
                <Text style={styles.detailsText}>Artiste: {selectedSong.artist || 'Inconnu'}</Text>
                <Text style={styles.detailsText}>Album: {selectedSong.album || 'Inconnu'}</Text>
                <Text style={styles.detailsText}>Format: {selectedSong.format || 'Non spécifié'}</Text>
                <Text style={styles.detailsText}>Taille: {selectedSong.size || 'Non spécifiée'}</Text>
                <Text style={styles.detailsText}>Chemin: {selectedSong.filePath || 'Non disponible'}</Text>
              </View>

              <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                <MaterialIcons name="close" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
} 
