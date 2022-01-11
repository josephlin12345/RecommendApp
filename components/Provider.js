import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';

export const UserContext = React.createContext();
export const SetUserContext = React.createContext();
export const getLocalUser = async () => {
  try {
    const user = await AsyncStorage.getItem('user');
    return user != null ? JSON.parse(user) : null;
  } catch { return null; }
}
export const UserProvider = ({ children }) => {
  const setLocalUser = new_user => {
    setUser(new_user);
    const user = JSON.stringify(new_user);
    AsyncStorage.setItem('user', user, () => {});
  }

  const [user, setUser] = useState(null);
  useEffect(async () => setUser(await getLocalUser()), []);

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
export const getLocalTheme = async () => {
  try {
    const theme = await AsyncStorage.getItem('theme');
    return theme != null ? JSON.parse(theme) : DefaultTheme;
  } catch { return DefaultTheme; }
}
export const ThemeProvider = ({ children }) => {
  const setLocalTheme = new_theme => {
    setTheme(new_theme);
    const theme = JSON.stringify(new_theme);
    AsyncStorage.setItem('theme', theme, () => {});
  }

  const toggleTheme = () => setLocalTheme(theme.dark ? DefaultTheme : DarkTheme);

  const [theme, setTheme] = useState(DefaultTheme);
  useEffect(async () => setTheme(await getLocalTheme()), []);

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