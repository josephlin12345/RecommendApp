import { useContext } from 'react';
import { Text, View } from 'react-native';
import { ThemeContext, UserContext } from '../components/Provider';
import styles from '../styles';

export default ProfileScreen = ({ route, navigation }) => {
  const user = useContext(UserContext);
  const theme = useContext(ThemeContext);

  return (
    <View style={styles.center}>
      {user ?
        <>
          <Text style={{ color: theme.colors.text }}>Profile</Text>
        </> :
        <>
          <Text style={{ color: theme.colors.text }}>尚未登入</Text>
          <Text style={{ color: theme.colors.text }}>需要登入才能查看!</Text>
        </>
      }
		</View>
  );
}