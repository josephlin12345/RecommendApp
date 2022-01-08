import { useContext } from 'react';
import { ScrollView, Text } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SetUserContext, ThemeContext, ToggleThemeContext, UserContext } from '../components/Provider';
import styles from '../styles';
import { createStackNavigator } from '@react-navigation/stack';

export default SettingScreen = () => {
  const Setting = () => {
    return (
      <ScrollView contentContainerStyle={styles.center}>
        {user ?
          <MaterialCommunityIcons.Button name='logout' size={styles.buttonIconSize} onPress={() => setUser(null)}>登出</MaterialCommunityIcons.Button> :
          <>
            <Text style={{ color: theme.colors.text }}>尚未登入</Text>
            <Text style={{ color: theme.colors.text }}>需要登入才能查看!</Text>
          </>
        }
        <Feather.Button name={theme.dark ? 'sun' : 'moon'} size={styles.buttonIconSize} onPress={toggleTheme}>{theme.dark ? 'light' : 'dark'}</Feather.Button>
      </ScrollView>
    );
  }

  const Stack = createStackNavigator();
  const user = useContext(UserContext);
  const setUser = useContext(SetUserContext);
  const theme = useContext(ThemeContext);
  const toggleTheme = useContext(ToggleThemeContext);

  return (
    <Stack.Navigator initialRouteName='設定 '>
      <Stack.Screen name='設定 ' component={Setting} />
    </Stack.Navigator>
  );
}