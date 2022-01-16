import { createStackNavigator } from '@react-navigation/stack';
import { useContext, useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Input from '../components/Input';
import { SetUserContext, UserContext } from '../components/Provider';
import { startLocationUpdate } from '../functions/location';
import { startScheduleNotification } from '../functions/notification';
import request from '../functions/request';
import styles from '../styles';

const HomeScreen = () => {
	const Login = ({ navigation: stackNavigation }) => {
		useEffect(() => { if(user) stackNavigation.replace('首頁 '); });

		const login = async user => {
			const response = await request('sign_in', 'post', user);
			if(response.error) Alert.alert('登入失敗!', response.error);
			else {
				await startLocationUpdate();
				await startScheduleNotification(user);
				setUser(user);
				stackNavigation.replace('首頁 ');
			};
		}

		const [email, setEmail] = useState('');
		const [password, setPassword] = useState('');

		return (
			<ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps='handled'>
				<View style={styles.container}>
					<Input label={'信箱 :'} value={email} setText={setEmail} secureTextEntry={false} />
					<Input label={'密碼 :'} value={password} setText={setPassword} secureTextEntry={true} />
					<View style={styles.horizontalGroup}>
						<MaterialCommunityIcons.Button name='login' size={styles.buttonIconSize} onPress={() => login({ email, password })}>登入</MaterialCommunityIcons.Button>
						<MaterialIcons.Button name='add-circle-outline' size={styles.buttonIconSize} onPress={() => stackNavigation.navigate('註冊')}>註冊</MaterialIcons.Button>
					</View>
				</View>
			</ScrollView>
		);
	}

	const Register = ({ navigation: stackNavigation }) => {
		const register = async newUser => {
			if(newUser.password != newUser.confirmPassword) {
				Alert.alert('註冊失敗!', '密碼需與確認密碼一致!');
				return
			}
			const result = await request('sign_up', 'post', {
				email: newUser.email,
				password: newUser.password
			});
			if(result.error) Alert.alert('註冊失敗!', result.error);
			else {
				Alert.alert('註冊成功!');
				stackNavigation.goBack();
			};
		}

		const [email, setEmail] = useState('');
		const [password, setPassword] = useState('');
		const [confirmPassword, setConfirmPassword] = useState('');
		const newUser = { email, password, confirmPassword };

		return (
			<ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps='handled'>
				<View style={styles.container}>
					<Input label={'信箱 :'} value={email} setText={setEmail} secureTextEntry={false} />
					<Input label={'密碼 :'} value={password} setText={setPassword} secureTextEntry={true} />
					<Input label={'確認密碼 :'} value={confirmPassword} setText={setConfirmPassword} secureTextEntry={true} />
					<View style={styles.horizontalGroup}>
						<Ionicons.Button name='send' size={styles.buttonIconSize} onPress={() => register(newUser)}>確認</Ionicons.Button>
					</View>
				</View>
			</ScrollView>
		);
	}

	// to do
	const Home = ({ navigation: stackNavigation }) => {
		useEffect(() => { if(!user) stackNavigation.replace('登入'); });

		return (
			<ScrollView contentContainerStyle={styles.scrollView}>
				<View style={styles.container}>
				</View>
			</ScrollView>
		);
	}

	const Stack = createStackNavigator();
	const user = useContext(UserContext);
	const setUser = useContext(SetUserContext);

	return (
		<Stack.Navigator initialRouteName='登入'>
			<Stack.Screen name='登入' component={Login} />
			<Stack.Screen name='註冊' component={Register} />
			<Stack.Screen name='首頁 ' component={Home} />
		</Stack.Navigator>
	);
}

export default HomeScreen;