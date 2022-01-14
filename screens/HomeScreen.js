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
		useEffect(() => { if(user) stackNavigation.replace('首頁 '); });

		return (
			<ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps='handled'>
				<View style={styles.containerWidth}>
					<Input text={'信箱 :'} setText={setEmail} secureTextEntry={false} textContentType='emailAddress' />
					<Input text={'密碼 :'} setText={setPassword} secureTextEntry={true} textContentType='password' />
					<View style={styles.verticalButtonGroup}>
						<MaterialCommunityIcons.Button name='login' size={styles.buttonIconSize} onPress={() => login({ email, password })}>登入</MaterialCommunityIcons.Button>
						<MaterialIcons.Button name='add-circle-outline' size={styles.buttonIconSize} onPress={() => stackNavigation.navigate('註冊')}>註冊</MaterialIcons.Button>
					</View>
				</View>
			</ScrollView>
		);
	}

	const Register = ({ navigation: stackNavigation }) => {
		const register = async user => {
			if(user.password != user.confirmPassword) {
				Alert.alert('註冊失敗!', '密碼需與確認密碼一致!');
				return
			}
			const result = await request('sign_up', 'post', user);
			if(result.error) Alert.alert('註冊失敗!', result.error);
			else {
				Alert.alert('註冊成功!');
				stackNavigation.goBack();
			};
		}
		const [email, setEmail] = useState('');
		const [password, setPassword] = useState('');
		const [confirmPassword, setConfirmPassword] = useState('');

		return (
			<ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps='handled'>
				<View style={styles.containerWidth}>
					<Input text={'信箱 :'} setText={setEmail} secureTextEntry={false} textContentType='emailAddress' />
					<Input text={'密碼 :'} setText={setPassword} secureTextEntry={true} textContentType='password' />
					<Input text={'確認密碼 :'} setText={setConfirmPassword} secureTextEntry={true} textContentType='password' />
					<View style={styles.verticalButtonGroup}>
						<Ionicons.Button name='send' size={styles.buttonIconSize} onPress={() => register({ email, password, confirmPassword })}>確認</Ionicons.Button>
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
				<View style={styles.containerWidth}>
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