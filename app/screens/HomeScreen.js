import { createStackNavigator } from '@react-navigation/stack';
import { useContext, useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Input from '../components/Input';
import { SetUserContext, UserContext } from '../components/Provider';
import request from '../functions/request';
import styles from '../styles';

export default HomeScreen = () => {
	const Login = ({ navigation }) => {
		const login = async user => {
			const response = await request('sign_in', 'post', user);
			if(response.error) Alert.alert('登入失敗!', response.error);
			else {
				setUser(user);
				navigation.replace('推薦');
			};
		}

		const [email, setEmail] = useState('');
		const [password, setPassword] = useState('');
		useEffect(() => { if(user) navigation.replace('推薦'); });

		return (
			<ScrollView contentContainerStyle={styles.center} keyboardShouldPersistTaps='handled'>
				<View style={styles.contentWidth}>
					<Input text={'信箱 :'} setText={setEmail} secureTextEntry={false} textContentType='emailAddress' />
					<Input text={'密碼 :'} setText={setPassword} secureTextEntry={true} textContentType='password' />
					<View style={styles.buttonGroup}>
						<MaterialCommunityIcons.Button name='login' size={styles.buttonIconSize} onPress={() => login({ email, password })}>登入</MaterialCommunityIcons.Button>
						<MaterialIcons.Button name='add-circle-outline' size={styles.buttonIconSize} onPress={() => navigation.navigate('註冊')}>註冊</MaterialIcons.Button>
					</View>
				</View>
			</ScrollView>
		);
	}

	const Register = ({ navigation }) => {
		const register = async user => {
			if(user.password != user.confirmPassword) {
				Alert.alert('註冊失敗!', '密碼需與確認密碼一致!');
				return
			}
			const result = await request('sign_up', 'post', user);
			if(result.error) Alert.alert('註冊失敗!', result.error);
			else {
				Alert.alert('註冊成功!');
				navigation.goBack();
			};
		}
		const [email, setEmail] = useState('');
		const [password, setPassword] = useState('');
		const [confirmPassword, setConfirmPassword] = useState('');

		return (
			<ScrollView contentContainerStyle={styles.center} keyboardShouldPersistTaps='handled'>
				<View style={styles.contentWidth}>
					<Input text={'信箱 :'} setText={setEmail} secureTextEntry={false} textContentType='emailAddress' />
					<Input text={'密碼 :'} setText={setPassword} secureTextEntry={true} textContentType='password' />
					<Input text={'確認密碼 :'} setText={setConfirmPassword} secureTextEntry={true} textContentType='password' />
					<View style={styles.buttonGroup}>
						<Ionicons.Button name='send' size={styles.buttonIconSize} onPress={() => register({ email, password, confirmPassword })}>確認</Ionicons.Button>
					</View>
				</View>
			</ScrollView>
		);
	}

	// to do
	const Recommend = ({ navigation }) => {
		useEffect(() => { if(!user) navigation.replace('登入'); });
		return (
			<ScrollView contentContainerStyle={styles.center}>
				<View style={styles.contentWidth}>
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
			<Stack.Screen name='推薦' component={Recommend} />
		</Stack.Navigator>
	);
}