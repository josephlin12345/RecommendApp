import { createStackNavigator } from '@react-navigation/stack';
import { useContext, useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Input from '../components/Input';
import { SetUserContext, ThemeContext, UserContext } from '../components/Provider';
import request from '../functions/request';
import styles from '../styles';

export default HomeScreen = () => {
	const Login = ({ navigation }) => {
		useEffect(() => { if(user) navigation.replace('Recommend'); });
		const login = async (email, password) => {
			const params = {
				email: email,
				password: password
			};
			const result = await request('sign_in', 'post', params);
			if('error' in result) Alert.alert('登入失敗!', result['error']);
			else {
				setUser(params);
				navigation.replace('Recommend');
			};
		}
		const [email, setEmail] = useState('');
		const [password, setPassword] = useState('');

		return (
			<View style={styles.center}>
				<Input text={'帳號 :'} setText={setEmail} secureTextEntry={false} />
				<Input text={'密碼 :'} setText={setPassword} secureTextEntry={true} />
				<View style={styles.buttonGroup}>
					<MaterialIcons.Button name='add-circle-outline' size={styles.buttonIconSize} onPress={() => navigation.navigate('Register')}>註冊</MaterialIcons.Button>
					<MaterialCommunityIcons.Button name='login' size={styles.buttonIconSize} onPress={() => login(email, password)}>登入</MaterialCommunityIcons.Button>
				</View>
			</View>
		);
	}

	const Register = () => {
		return (
			<View style={styles.center}>
				<Text style={{ color: theme.colors.text }}>Register</Text>
			</View>
		);
	}

	const Recommend = ({ navigation }) => {
		useEffect(() => { if(!user) navigation.replace('Login'); });
		return (
			<View style={styles.center}>
				<Text style={{ color: theme.colors.text }}>Recommend</Text>
			</View>
		);
	}

	const user = useContext(UserContext);
	const setUser = useContext(SetUserContext);
	const Stack = createStackNavigator();
	const theme = useContext(ThemeContext);

	return (
		<Stack.Navigator initialRouteName='login'>
			<Stack.Screen name='Login' component={Login} />
			<Stack.Screen name='Register' component={Register} />
			<Stack.Screen name='Recommend' component={Recommend} />
		</Stack.Navigator>
	);
}