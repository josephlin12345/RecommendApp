import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Provider } from './components/Provider';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingScreen from './screens/SettingScreen';

const App = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Provider>
      <Tab.Navigator initialRouteName='Home'>
        <Tab.Screen name='Home' component={HomeScreen} options={{
          tabBarIcon: ({color, size}) => <Ionicons name='home-outline' size={size} color={color}/>
        }} />
        <Tab.Screen name='Profile' component={ProfileScreen} options={{
          tabBarIcon: ({color, size}) => <AntDesign name='profile' size={size} color={color}/>
        }} />
        <Tab.Screen name='Setting' component={SettingScreen} options={{
          tabBarIcon: ({color, size}) => <Ionicons name='md-settings-outline' size={size} color={color}/>
        }} />
      </Tab.Navigator>
    </Provider>
  );
}

export default App;