import { createStackNavigator } from '@react-navigation/stack';
import * as Location from 'expo-location';
import { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SetUserContext, ThemeContext, ToggleThemeContext, UserContext } from '../components/Provider';
import { LOCATION_UPDATE_TASK_NAME } from '../constant';
import { startLocationUpdate, stopLocationUpdate } from '../functions/location';
import { stopScheduleNotification } from '../functions/notification';
import styles from '../styles';

const SettingScreen = ({ navigation }) => {
  const Setting = () => {
    const logout = async () => {
      setUser(null);
      stopLocationUpdate();
      stopScheduleNotification();
      navigation.navigate('首頁');
    }

    const toggleLocationUpdate = () => {
      if(locationUpdate) stopLocationUpdate();
      else startLocationUpdate();
      setLocationUpdate(!locationUpdate);
    }

    const [locationUpdate, setLocationUpdate] = useState(true);
    // fix
    useEffect(async () => {
      setLocationUpdate(await Location.hasStartedLocationUpdatesAsync(LOCATION_UPDATE_TASK_NAME));
    });

    return (
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.containerWidth}>
          <View style={settingStyles.innerContainer}>
            <Feather.Button name={theme.dark ? 'sun' : 'moon'} size={styles.buttonIconSize} onPress={toggleTheme}>{theme.dark ? '淺色' : '深色'}</Feather.Button>
            {user &&
              <>
                <MaterialCommunityIcons.Button name='logout' size={styles.buttonIconSize} onPress={logout}>登出</MaterialCommunityIcons.Button>
                <View style={settingStyles.switchContainer}>
                  <Text style={{ color: theme.colors.text, ...settingStyles.switchLabel, ...styles.text }}>追蹤位置</Text>
                  <Switch
                    style={settingStyles.switch}
                    trackColor={{ false: theme.colors.primary, true: theme.colors.primary }}
                    onValueChange={toggleLocationUpdate}
                    value={locationUpdate}
                  />
                </View>
              </>
            }
          </View>
        </View>
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

const settingStyles = StyleSheet.create({
  innerContainer: {
    width: '30%',
    height: 200,
    justifyContent: 'space-between'
  },
  switchContainer: {
    flexDirection: 'row'
  },
  switchLabel: {
    alignSelf: 'center'
  },
  switch: {
    paddingRight: 20
  }
});

export default SettingScreen;