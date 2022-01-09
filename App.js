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
      <Tab.Navigator initialRouteName='Home' screenOptions={{headerShown: false}}>
        <Tab.Screen name='首頁' component={HomeScreen} options={{
          tabBarIcon: ({color, size}) => <Ionicons name='home-outline' size={size} color={color}/>
        }} />
        <Tab.Screen name='個人資料' component={ProfileScreen} options={{
          tabBarIcon: ({color, size}) => <AntDesign name='profile' size={size} color={color}/>
        }} />
        <Tab.Screen name='設定' component={SettingScreen} options={{
          tabBarIcon: ({color, size}) => <Ionicons name='md-settings-outline' size={size} color={color}/>
        }} />
      </Tab.Navigator>
    </Provider>
  );
}

export default App;