import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MusicList } from '../components';
import { useAudioFiles } from '../hooks';
import { styles } from '@/style/home.styles';

const Tab = createBottomTabNavigator();

function TracksScreen() {
  const songs = useAudioFiles();
  return <MusicList songs={songs} />;
}

function ArtistsScreen() {
  return (
    <View style={styles.centeredView}>
      <Text>Liste des Artistes</Text>
    </View>
  );
}

function AlbumsScreen() {
  return (
    <View style={styles.centeredView}>
      <Text>Liste des Albums</Text>
    </View>
  );
}

function PlaylistScreen() {
  return (
    <View style={styles.centeredView}>
      <Text>Playlist</Text>
    </View>
  );
}

export function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Music</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="search" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="more-horiz" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBarStyle,
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen
          name="Piste"
          component={TracksScreen}
          options={{
            tabBarIcon: ({ color }) => <MaterialIcons name="library-music" size={24} color={color} />,
            tabBarLabel: 'Piste',
          }}
        />
        <Tab.Screen
          name="Artistes"
          component={ArtistsScreen}
          options={{
            tabBarIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} />,
            tabBarLabel: 'Artistes',
          }}
        />
        <Tab.Screen
          name="Albums"
          component={AlbumsScreen}
          options={{
            tabBarIcon: ({ color }) => <MaterialIcons name="album" size={24} color={color} />,
            tabBarLabel: 'Albums',
          }}
        />
        <Tab.Screen
          name="Playlist"
          component={PlaylistScreen}
          options={{
            tabBarIcon: ({ color }) => <MaterialIcons name="queue-music" size={24} color={color} />,
            tabBarLabel: 'Playlist',
          }}
        />
      </Tab.Navigator>
    </View>
  );
}
