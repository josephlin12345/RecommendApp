import { createStackNavigator } from '@react-navigation/stack';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Linking, Modal, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Input from '../components/Input';
import { SetUserContext, ThemeContext, UserContext } from '../components/Provider';
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
			<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps='handled'>
				<View style={styles.innerContainer}>
					<Input label={'信箱 :'} value={email} setText={setEmail} secureTextEntry={false} />
					<Input label={'密碼 :'} value={password} setText={setPassword} secureTextEntry={true} />
					<View style={styles.horizontalGroup}>
						<MaterialIcons.Button name='login' size={styles.buttonIconSize} onPress={() => login({ email, password })}>登入</MaterialIcons.Button>
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
			const response = await request('sign_up', 'post', {
				email: newUser.email,
				password: newUser.password
			});
			if(response.error) Alert.alert('註冊失敗!', response.error);
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
			<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps='handled'>
				<View style={styles.innerContainer}>
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

	const Home = ({ navigation: stackNavigation }) => {
		useEffect(() => { if(!user) stackNavigation.replace('登入'); });

		const Event = ({ item: event }) => (
			<TouchableHighlight
				style={[
					homeStyles.eventContainer,
					homeStyles.block,
					{
						borderColor: theme.colors.border,
						backgroundColor: theme.colors.background,
						shadowColor: theme.colors.text
					}
				]}
				underlayColor={'gray'}
				onPress={() => openModal(event)}
			>
				<>
					<Image style={homeStyles.eventImage} source={{ uri: event.content.image }} resizeMode='center' />
					<Text style={{ color: theme.colors.text }}>{event.content.title}</Text>
				</>
			</TouchableHighlight>
		);

		const openModal = event => {
			request('history', 'post', { ...user, title: event.content.title });
			setModalVisible(true);
			setSelectedEvent(event);
		}

		const loadEvents = async () => {
			setShowIndicator(true);
			const response = await request('event', 'get', queryParams);
			if(response.error) Alert.alert('取得活動失敗!', response.error);
			else
				if(response.result.length) {
					setEvents(prev => [...prev, ...response.result]);
					setQueryParams(prev => ({ ...prev, offset: prev.offset + response.result.length }));
				}
				else setShowIndicator(false);
		}

		const [selectedEvent, setSelectedEvent] = useState(null);
		const [modalVisible, setModalVisible] =useState(false);
		const [events, setEvents] = useState([]);
		const [showIndicator, setShowIndicator] = useState(true);
		const [queryParams, setQueryParams] = useState({ limit: 10, offset: 0 });
		const translatedEvent = selectedEvent && {
			名稱: selectedEvent.content.title,
			建立者: selectedEvent.content.organizer,
			詳情: selectedEvent.content.detail
		};
		useEffect(async () => await loadEvents(), []);

		return (
			<>
				<FlatList
					data={events}
					renderItem={Event}
					keyExtractor={event => event._id}
					numColumns={2}
					onEndReachedThreshold={0}
					onEndReached={loadEvents}
					ListFooterComponent={showIndicator && <ActivityIndicator size={'large'} color={theme.colors.primary}/>}
				/>
				{selectedEvent &&
					<Modal animationType='fade' transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
						<View style={homeStyles.modalContainer}>
							<View style={[homeStyles.modal, homeStyles.block, { borderColor: theme.colors.border, shadowColor: theme.colors.text }]}>
								<ScrollView contentContainerStyle={homeStyles.modalScrollView} keyboardShouldPersistTaps='handled'>
									<Image style={homeStyles.eventImage} source={{ uri: selectedEvent.content.image }} resizeMode='center' />
									{Object.entries(translatedEvent).map(([label, value]) =>
										<View key={label}>
											<Text style={[homeStyles.modalLabel, { color: theme.colors.card }]}>{label} :</Text>
											<Text style={{ color: theme.colors.text }}>{value}</Text>
										</View>
									)}
								</ScrollView>
								<View style={styles.horizontalGroup}>
									<Ionicons.Button name='close-circle' size={styles.buttonIconSize} onPress={() => setModalVisible(false)}>關閉</Ionicons.Button>
									<Ionicons.Button name='arrow-forward-circle' size={styles.buttonIconSize} onPress={() => Linking.openURL(selectedEvent.content.url)}>前往</Ionicons.Button>
								</View>
							</View>
						</View>
					</Modal>
				}
			</>
		);
	}

	const Stack = createStackNavigator();
	const user = useContext(UserContext);
	const setUser = useContext(SetUserContext);
	const theme = useContext(ThemeContext);

	return (
		<Stack.Navigator initialRouteName='登入'>
			<Stack.Screen name='登入' component={Login} />
			<Stack.Screen name='註冊' component={Register} />
			<Stack.Screen name='首頁 ' component={Home} />
		</Stack.Navigator>
	);
}

const homeStyles = StyleSheet.create({
  eventContainer: {
		margin: 10,
		alignItems: 'center',
		width: '45%'
  },
	eventImage: {
		maxWidth: '100%',
		width: 500,
		height: 150,
		marginBottom: 10
	},
	modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
		width: '90%',
		height: '80%',
		backgroundColor: 'gray'
  },
	modalScrollView: {
		padding: 10
	},
	modalLabel: {
		fontSize: 20,
		paddingVertical: 5
	},
	block: {
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
		borderWidth: 2,
    borderRadius: 20,
    padding: 10
	}
});

export default HomeScreen;