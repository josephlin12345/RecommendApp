import DateTimePicker from '@react-native-community/datetimepicker';
import { createStackNavigator } from '@react-navigation/stack';
import { useContext, useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Input from '../components/Input';
import { SetUserContext, ThemeContext, UserContext } from '../components/Provider';
import { GENDERS } from '../constant';
import request from '../functions/request';
import styles from '../styles';

const ProfileScreen = () => {
  const Profile = ({ navigation: stackNavigation }) => {
    const translatedPorfile = profile && {
      信箱: profile.email,
      名稱: profile.name,
      姓別: profile.gender ? GENDERS[profile.gender] : '無',
      生日: dateToLocalString(parseDatetimeString(profile.birthday))
    };

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.innerContainer, profileStyles.profile]}>
          {user ? profile &&
            <>
              {Object.entries(translatedPorfile).map(([label, value]) =>
                <View key={label}>
                  <Text style={[styles.text, { color: theme.colors.primary }]}>{label} :</Text>
                  <Text style={[styles.text, { color: theme.colors.text }]}>{value}</Text>
                </View>
              )}
              <View style={styles.horizontalGroup}>
                <FontAwesome5.Button name='edit' size={styles.buttonIconSize} onPress={() => stackNavigation.navigate('編輯個人資料')}>編輯個人資料</FontAwesome5.Button>
                <FontAwesome5.Button name='edit' size={styles.buttonIconSize} onPress={() => stackNavigation.navigate('變更密碼')}>變更密碼</FontAwesome5.Button>
              </View>
            </> :
            <Text style={[styles.text, { color: theme.colors.notification }]}>需要登入才能查看!</Text>
          }
        </View>
      </ScrollView>
    );
  }

  const EditProfile = ({ navigation: stackNavigation }) => {
    useEffect(() => { if(!user) stackNavigation.goBack(); });

    const editProfile = async (user, newProfile) => {
			const result = await request('profile', 'patch', {
        email: user.email,
        password: user.password,
        name: newProfile.name,
        birthday: dateToLocalString(newProfile.birthday),
        gender: newProfile.gender
      });
			if(result.error) Alert.alert('編輯失敗!', result.error);
			else {
				Alert.alert('編輯成功!');
        await refreshProfile(user);
				stackNavigation.goBack();
			};
    }

    const pickBirthday = (_, date) => {
      setShowBirthdayPicker(Platform.OS === 'ios');
      setBirthday(date || birthday);
    }

    const [name, setName] = useState(profile.name);
    const now = new Date();
    const [birthday, setBirthday] = useState(profile.birthday ? parseDatetimeString(profile.birthday) : now);
    const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);
    const [gender, setGender] = useState(profile.gender || 'X');
    const newProfile = { name, birthday, gender };

    return (
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps='handled'>
        <View style={styles.innerContainer}>
          <Input label={'名稱 :'} value={name} setText={setName} secureTextEntry={false} />
          <Text style={[styles.text, { color: theme.colors.primary }]}>生日:</Text>
          <View style={[styles.horizontalGroup, profileStyles.profileItem]}>
            <Feather.Button name='calendar' size={styles.buttonIconSize} onPress={() => setShowBirthdayPicker(true)}>選擇</Feather.Button>
            <Text style={[styles.text, { color: theme.colors.text }]}>{dateToLocalString(birthday)}</Text>
            {showBirthdayPicker && <DateTimePicker value={birthday} onChange={pickBirthday} maximumDate={now} />}
          </View>
          <Text style={[styles.text, { color: theme.colors.primary }]}>性別:</Text>
          <View style={[styles.horizontalGroup, profileStyles.profileItem]}>
            {Object.entries(GENDERS).map(([label, value]) =>
              <TouchableOpacity key={label} style={[styles.horizontalGroup, profileStyles.profileItem]} onPress={() => setGender(label)} activeOpacity={0.5}>
                <Text style={[styles.text, { color: theme.colors.text }]}>{value}</Text>
                <View style={[profileStyles.radioButton, { borderColor: theme.colors.text }]}>
                  {label == gender && <View style={[profileStyles.radioButtonSelected, { backgroundColor: theme.colors.text }]} />}
                </View>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.horizontalGroup}>
            <Ionicons.Button name='send' size={styles.buttonIconSize} onPress={() => editProfile(user, newProfile)}>確認</Ionicons.Button>
          </View>
        </View>
      </ScrollView>
    );
  }

  const ChangePassword = ({ navigation: stackNavigation }) => {
    useEffect(() => { if(!user) stackNavigation.goBack(); });

    const changePassword = async (user, password) => {
			if(user.password != password.oldPassword) {
				Alert.alert('變更失敗!', '舊密碼錯誤!');
				return
			}
			if(password.newPassword != password.confirmNewPassword) {
				Alert.alert('變更失敗!', '新密碼需與確認新密碼一致!');
				return
			}
			const result = await request('password', 'patch', {
        email: user.email,
        password: user.password,
        new_password: password.newPassword
      });
			if(result.error) Alert.alert('變更失敗!', result.error);
			else {
        setUser({ email: user.email, password: password.newPassword });
				Alert.alert('變更成功!');
				stackNavigation.goBack();
			};
    }

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setconfirmNewPassword] = useState('');
    const password = { oldPassword, newPassword, confirmNewPassword };

    return (
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps='handled'>
        <View style={styles.innerContainer}>
          <Input label={'舊密碼 :'} value={oldPassword} setText={setOldPassword} secureTextEntry={true} />
          <Input label={'新密碼 :'} value={newPassword} setText={setNewPassword} secureTextEntry={true} />
          <Input label={'確認新密碼 :'} value={confirmNewPassword} setText={setconfirmNewPassword} secureTextEntry={true} />
          <View style={styles.horizontalGroup}>
            <Ionicons.Button name='send' size={styles.buttonIconSize} onPress={() => changePassword(user, password)}>確認</Ionicons.Button>
          </View>
        </View>
      </ScrollView>
    );
  }

  const refreshProfile = async user => {
    const response = await request('profile', 'get', user);
    if(response.error) Alert.alert('取得個人資料失敗!', response.error);
    else setProfile(response.result);
  }

  const parseDatetimeString = datetimeString => new Date(datetimeString.replace(' ', 'T'));

  const dateToLocalString = date => `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

  const Stack = createStackNavigator();
  const theme = useContext(ThemeContext);
  const user = useContext(UserContext);
  const setUser = useContext(SetUserContext);
  const [profile, setProfile] = useState(null);
  useEffect(() => { if(user) refreshProfile(user); }, [user]);

  return (
    <Stack.Navigator initialRouteName='個人資料 '>
			<Stack.Screen name='個人資料 ' component={Profile} />
			<Stack.Screen name='編輯個人資料' component={EditProfile} />
			<Stack.Screen name='變更密碼' component={ChangePassword} />
		</Stack.Navigator>
  );
}

const profileStyles = StyleSheet.create({
  profile: {
    height: 500,
    justifyContent: 'space-between'
  },
  profileItem: {
    alignItems: 'center',
    marginVertical: 30
  },
  radioButton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5
  },
  radioButtonSelected: {
    height: 12,
    width: 12,
    borderRadius: 6
  }
});

export default ProfileScreen;