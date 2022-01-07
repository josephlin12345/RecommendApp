import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemeContext, ToggleThemeContext, UserProvider } from './components/Provider';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingScreen from './screens/SettingScreen';

const App = () => {
  const getLocalTheme = async () => {
    try {
      const theme = await AsyncStorage.getItem('theme');
      return theme != null ? JSON.parse(theme) : DefaultTheme;
    } catch {
      Alert.alert('error!', 'can not get local theme');
      return DefaultTheme;
    }
  }

  const setLocalTheme = async new_theme => {
    try {
      setTheme(new_theme);
      const theme = JSON.stringify(new_theme);
      await AsyncStorage.setItem('theme', theme);
    } catch { Alert.alert('error!', 'can not set local theme'); }
  }

  const toggleTheme = () => {
    const new_theme = theme.dark ? DefaultTheme : DarkTheme;
    setTheme(new_theme);
    setLocalTheme(new_theme);
  }

  const Tab = createBottomTabNavigator();
  const [theme, setTheme] = useState(DefaultTheme);
  useEffect(async () => {
    const theme = await getLocalTheme();
    setTheme(theme);
  }, []);

  return (
    <UserProvider>
      <ThemeContext.Provider value={theme}>
        <ToggleThemeContext.Provider value={toggleTheme}>
          <NavigationContainer theme={theme}>
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
          </NavigationContainer>
        </ToggleThemeContext.Provider>
      </ThemeContext.Provider>
    </UserProvider>
  );
}

export default App;