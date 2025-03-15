import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AudioList from '@/components/AudioList';
import AudioPlayer from '@/components/AudioPlayer';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="AudioList">
      <Stack.Screen name="AudioList" component={AudioList} />
      <Stack.Screen name="AudioPlayer" component={AudioPlayer} />
    </Stack.Navigator>
  );
};

export default App;
