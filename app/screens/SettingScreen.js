import { useContext } from 'react';
import { Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { SetUserContext, UserContext, ThemeContext, ToggleThemeContext } from '../components/Provider';
import styles from '../styles';

export default SettingScreen = () => {
  const user = useContext(UserContext);
  const setUser = useContext(SetUserContext);
  const theme = useContext(ThemeContext);
  const toggleTheme = useContext(ToggleThemeContext);

  return (
    <View style={styles.center}>
      {user ?
        <MaterialCommunityIcons.Button name='logout' size={styles.buttonIconSize} onPress={() => setUser(null)}>登出</MaterialCommunityIcons.Button> :
        <>
          <Text style={{ color: theme.colors.text }}>尚未登入</Text>
          <Text style={{ color: theme.colors.text }}>需要登入才能查看!</Text>
        </>
      }
      <Feather.Button name={theme.dark ? 'sun' : 'moon'} size={styles.buttonIconSize} onPress={toggleTheme}>{theme.dark ? 'light' : 'dark'}</Feather.Button>
    </View>
  );
}