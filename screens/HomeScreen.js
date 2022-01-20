import { createStackNavigator } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Keyboard, Linking, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, TouchableWithoutFeedback, View } from 'react-native';
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
			setSelectedEvent(event);
			setModalVisible(true);
		}

		const loadEvents = async params => {
			const response = await request('event', 'get', params);
			if(response.error) {
				setCanLoad(false);
				Alert.alert('取得活動失敗!', response.error);
			}
			else
				if(response.result.length) {
					setEvents(prev => [...prev, ...response.result]);
					setQueryParams({ ...params, offset: params.offset + response.result.length });
				}
				else setCanLoad(false);
		}

		const resetEvents = async () => {
			setCanLoad(true);
			setEvents([]);
			await loadEvents({ ...queryParams, offset: 0 });
		}

		const search = () => {
			Keyboard.dismiss();
			resetEvents();
		}

		const refresh = async () => {
			setRefreshing(true);
			await resetEvents();
			setRefreshing(false);
		}

		const [selectedEvent, setSelectedEvent] = useState(null);
		const [modalVisible, setModalVisible] =useState(false);
		const [events, setEvents] = useState([]);
		const [canLoad, setCanLoad] = useState(true);
		const [refreshing, setRefreshing] = useState(false);
		const [queryParams, setQueryParams] = useState({ limit: 10, offset: 0, q: '' });
		const translatedEvent = selectedEvent && {
			名稱: selectedEvent.content.title,
			建立者: selectedEvent.content.organizer,
			詳情: selectedEvent.content.detail
		};
		useEffect(async () => {
			loadEvents(queryParams);
			const subscription = Notifications.addNotificationResponseReceivedListener(
				({ notification: { request: { content: { data: { event } } } } }) => {
					openModal(event);
        	Linking.openURL(event.content.url);
				}
			);
			return () => subscription.remove();
		}, []);

		return (
			<>
				<View style={[styles.horizontalGroup, homeStyles.searchBar]}>
					<Ionicons.Button
						name='search'
						size={styles.buttonIconSize}
						borderRadius={50}
						iconStyle={homeStyles.searchIcon}
						onPress={search}
					/>
					<TextInput
						style={[
							homeStyles.searchTextInput,
							homeStyles.block,
							{
								color: theme.colors.text,
								backgroundColor: theme.colors.card,
								borderColor: theme.colors.border,
								shadowColor: theme.colors.text
							}
						]}
						autoCapitalize={'none'}
						placeholder={'搜尋'}
						placeholderTextColor={theme.colors.text}
						onChangeText={text => setQueryParams(prev => ({ ...prev, q: text }))}
						onSubmitEditing={search}
					/>
				</View>
				<FlatList
					data={events}
					renderItem={Event}
					keyExtractor={event => event._id}
					numColumns={2}
					onRefresh={refresh}
					refreshing={refreshing}
					onEndReachedThreshold={0}
					onEndReached={() => { if(canLoad) loadEvents(queryParams); }}
					ListFooterComponent={canLoad && !refreshing && <ActivityIndicator size={'large'} color={theme.colors.primary}/>}
				/>
				{selectedEvent &&
					<Modal animationType='fade' transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
						<TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
							<View style={homeStyles.modalOverlay} />
						</TouchableWithoutFeedback>
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
								<View style={[styles.horizontalGroup, homeStyles.modalButtonGroup]}>
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
	modalButtonGroup: {
		paddingTop: 10
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
	},
	modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
	searchBar: {
		width: '90%',
		alignSelf: 'center',
		alignItems: 'center',
		marginVertical: 10
	},
	searchTextInput: {
		flex: 1,
		marginRight: 10,
		fontSize: 15
	},
	searchIcon: {
		marginRight: 0
	}
});

export default HomeScreen;