import { createStackNavigator } from '@react-navigation/stack';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SetUserContext, ThemeContext, ToggleThemeContext, UserContext } from '../components/Provider';
import { LOCATION_UPDATE_TASK_NAME } from '../constant';
import { startLocationUpdate, stopLocationUpdate } from '../functions/location';
import { startScheduleNotification, stopScheduleNotification } from '../functions/notification';
import styles from '../styles';

const SettingScreen = ({ navigation }) => {
  const Setting = () => {
    const logout = async () => {
      await stopLocationUpdate();
      await stopScheduleNotification();
      setUser(null);
      navigation.navigate('首頁');
    }

    const toggleLocationUpdate = () => {
      if(locationUpdate) stopLocationUpdate();
      else startLocationUpdate();
      setLocationUpdate(!locationUpdate);
    }

    const toggleScheduleNotification = () => {
      if(scheduleNotification) stopScheduleNotification();
      else startScheduleNotification(user);
      setScheduleNotification(!scheduleNotification);
    }

    const [locationUpdate, setLocationUpdate] = useState(true);
    const [scheduleNotification, setScheduleNotification] = useState(true);
    const switches = [{
      label: '深色模式',
      onValueChange: toggleTheme,
      value: theme.dark
    }];
    if(user) {
      switches.push({
        label: '追蹤位置',
        onValueChange: toggleLocationUpdate,
        value: locationUpdate
      });
      switches.push({
        label: '推送通知',
        onValueChange: toggleScheduleNotification,
        value: scheduleNotification
      });
    }
    useEffect(async () => {
      setLocationUpdate(await Location.hasStartedLocationUpdatesAsync(LOCATION_UPDATE_TASK_NAME));
      setScheduleNotification((await Notifications.getAllScheduledNotificationsAsync()).length ? true : false);
    }, [user]);

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.innerContainer, settingStyles.setting]}>
          {switches.map(item =>
            <View key={item.label} style={settingStyles.switchContainer}>
              <Text style={[styles.text, { color: theme.colors.text }]}>{item.label}</Text>
              <Switch
                trackColor={{ false: theme.colors.primary, true: theme.colors.primary }}
                onValueChange={item.onValueChange}
                value={item.value}
              />
            </View>
          )}
          {user &&
            <View style={styles.horizontalGroup}>
              <MaterialCommunityIcons.Button name='logout' size={styles.buttonIconSize} onPress={logout}>登出</MaterialCommunityIcons.Button>
            </View>
          }
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
  setting: {
    height: 400,
    justifyContent: 'space-between'
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  }
});

export default SettingScreen;