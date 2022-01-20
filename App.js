import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as TaskManager from 'expo-task-manager';
import React, { useEffect } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getLocalUser, Provider } from './components/Provider';
import { BACKGROUND_FETCH_TASK_NAME, LOCATION_UPDATE_TASK_NAME } from './constant';
import { sendLocation } from './functions/location';
import { startScheduleNotification, updateNotification } from './functions/notification';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingScreen from './screens/SettingScreen';

TaskManager.defineTask(LOCATION_UPDATE_TASK_NAME, async ({ data: { locations: [location] }, error }) => {
  if(!error) {
    const user = await getLocalUser();
    if(user) sendLocation(location, user);
  }
});
TaskManager.defineTask(BACKGROUND_FETCH_TASK_NAME, async () => {
  const user = await getLocalUser();
  if(user) updateNotification(user);
});

const App = () => {
  const Tab = createBottomTabNavigator();
  useEffect(async () => {
    const user = await getLocalUser();
    if(user) startScheduleNotification(user);
  }, []);

  return (
    <Provider>
      <Tab.Navigator initialRouteName='首頁' screenOptions={{headerShown: false}}>
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