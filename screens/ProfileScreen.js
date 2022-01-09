import { createStackNavigator } from '@react-navigation/stack';
import { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { ThemeContext, UserContext } from '../components/Provider';
import request from '../functions/request';
import styles from '../styles';

const ProfileScreen = () => {
  const Profile = ({ navigation }) => {
    return (
      <ScrollView contentContainerStyle={styles.center}>
        <View style={styles.contentWidth}>
          {user ?
            <>
              {profile && Object.entries(profile).map(([k, v]) =>
                <View key={k}>
                  <Text style={{ color: theme.colors.primary, ...profileStyles.profileItem }}>{k} :</Text>
                  <Text style={{ color: theme.colors.text, ...profileStyles.profileItem }}>{v}</Text>
                </View>
                )
              }
              <View style={styles.buttonGroup}>
                <FontAwesome5.Button name='edit' size={styles.buttonIconSize} onPress={() => navigation.navigate('編輯個人資料')}>編輯</FontAwesome5.Button>
              </View>
            </> :
            <>
              <Text style={{ color: theme.colors.text, ...profileStyles.profileItem }}>尚未登入!</Text>
              <Text style={{ color: theme.colors.text, ...profileStyles.profileItem }}>需要登入才能查看!</Text>
            </>
          }
        </View>
      </ScrollView>
    );
  }

  // to do
  const EditProfile = () => {
    return (
      <></>
    );
  }

  const refreshProfile = async user => {
    const profile = (await request('profile', 'get', user)).result;
    setProfile(profile);
  }

  const Stack = createStackNavigator();
  const theme = useContext(ThemeContext);
  const user = useContext(UserContext);
  const [profile, setProfile] = useState(null);
  useEffect(() => { if(user) refreshProfile(user); }, [user]);

  return (
    <Stack.Navigator initialRouteName='個人資料 '>
			<Stack.Screen name='個人資料 ' component={Profile} />
			<Stack.Screen name='編輯個人資料' component={EditProfile} />
		</Stack.Navigator>
  );
}

const profileStyles = StyleSheet.create({
  profileItem: {
    paddingVertical: 5,
    fontSize: 20
  }
});

export default ProfileScreen;