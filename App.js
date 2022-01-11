import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import React, { useEffect } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getLocalUser, Provider } from './components/Provider';
import request from './functions/request';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingScreen from './screens/SettingScreen';

const LocationUpdateTaskName = 'LocationUpdate';
// TaskManager: Task "LocationUpdate" failed:, [Error: Geocoder is not running.]
TaskManager.defineTask(LocationUpdateTaskName, async ({ data: { locations: [location] }, error }) => {
  if(!error) {
    const user = await getLocalUser();
    try {
      const [address] = await Location.reverseGeocodeAsync(location.coords);
      console.log(location.coords, address);
      if(isNaN(address.name) && user) request('history', 'post', { ...user, title: address.name });
    } catch(e) { console.log(e); }
  }
});

const App = () => {
  const Tab = createBottomTabNavigator();
  useEffect(async () => {
    const foregroundPermissions = await Location.requestForegroundPermissionsAsync();
    const backgroundPermissions = await Location.requestBackgroundPermissionsAsync();
    if(foregroundPermissions.granted && backgroundPermissions.granted)
      Location.startLocationUpdatesAsync(LocationUpdateTaskName, {
        foregroundService: {
          notificationTitle: 'Recommend',
          notificationBody: 'tracking location in background'
        }
      });
  }, []);

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