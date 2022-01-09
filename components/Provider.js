import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import request from '../functions/request';

export const UserContext = React.createContext();
export const SetUserContext = React.createContext();
export const UserProvider = ({ children }) => {
  const getLocalUser = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      return user != null ? JSON.parse(user) : null;
    } catch {
      Alert.alert('error!', 'can not get local user');
      return null;
    }
  }

  const setLocalUser = async new_user => {
    try {
      setUser(new_user);
      const user = JSON.stringify(new_user);
      await AsyncStorage.setItem('user', user);
    } catch { Alert.alert('error!', 'can not set local user'); }
  }

  const [user, setUser] = useState(null);
  const LocationUpdateTaskName = 'LocationUpdate';
  TaskManager.defineTask(LocationUpdateTaskName, async ({ data: { locations: [location] }, error }) => {
    if(!error) {
      try {
        const [address] = await Location.reverseGeocodeAsync(location.coords);
        if(address.name && user) await request('history', 'post', { ...user, title: address.name });
      } catch {}
    }
  });
  useEffect(async () => {
    const user = await getLocalUser();
    setUser(user);
    await Location.requestForegroundPermissionsAsync();
    await Location.requestBackgroundPermissionsAsync();
    await Location.startLocationUpdatesAsync(LocationUpdateTaskName);
  }, []);

  return (
    <UserContext.Provider value={user}>
      <SetUserContext.Provider value={setLocalUser}>
        {children}
      </SetUserContext.Provider>
    </UserContext.Provider>
  );
}

export const ThemeContext = React.createContext();
export const ToggleThemeContext = React.createContext();
export const ThemeProvider = ({ children }) => {
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
    setLocalTheme(new_theme);
  }

  const [theme, setTheme] = useState(DefaultTheme);
  useEffect(async () => {
    const theme = await getLocalTheme();
    setTheme(theme);
  }, []);

  return (
    <ThemeContext.Provider value={theme}>
      <ToggleThemeContext.Provider value={toggleTheme}>
        <NavigationContainer theme={theme}>
          {children}
        </NavigationContainer>
      </ToggleThemeContext.Provider>
    </ThemeContext.Provider>
  );
}

export const Provider = ({ children }) => {
  return (
    <UserProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </UserProvider>
  );
}