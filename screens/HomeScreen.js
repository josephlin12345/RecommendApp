import { createStackNavigator } from '@react-navigation/stack';
import { useContext, useEffect, useState } from 'react';
import { Alert, FlatList, Image, Linking, Modal, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
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
			// request('history', 'post', { ...user, title: event.content.title });
			setModalVisible(true);
			setSelectedEvent(event);
		}

		const [selectedEvent, setSelectedEvent] = useState(null);
		const [modalVisible, setModalVisible] =useState(false);
		const events = [
			{
				'_id': '61ce2bc107db41fdf6b18696',
				'content': {
						'title': '【SteelSeries 賽睿】Arctis PRO + GameDAC有線電競耳麥',
						'organizer': 'PCHOME',
						'detail': 'Arctis Pro + GameDAC Hi-Res 遊戲音效系統的每個元件皆經過精心設計，從 PS4 或電腦的數位輸出，一直到耳機，最終抵達您耳中，保持原始非凡的音效體驗。GameDAC：高保真數位轉類比轉接器 (DAC)高品質精細音訊頂級高解析喇叭奢華豪華拋光鋼與鋁合金結構',
						'price': 8990,
						'url': 'https://24h.pchome.com.tw/prod/DCAY0P-A900B2XMY',
						'image': 'https://b.ecimg.tw/items/DCAY0PA900B2XMY/000001_1638168457.jpg'
				},
				'establisher': 'admin@gmail.com',
				'modifyDate': '2021-12-30 21:59:29.539000',
				'createDate': '2021-12-30 21:59:29.539000'
		},
		{
				'_id': '61ce2bc107db41fdf6b18697',
				'content': {
						'title': 'Turtle Beach Stealth 700 Gen 2無線耳罩電競耳機 PS版本｜電競新標竿 為遊戲而聲',
						'organizer': 'PCHOME',
						'detail': '無線暢玩｜透過USB無線發射器，實現無線遊玩的便利性聽音辨位｜獨家Superhuman Hearing®超能聽音辨位專利技術，體現所有音效細節頂級單體｜採用高穿透指向性50mm釹磁鐵驅動單體，不只呈現遊戲音效，也能用於音樂體驗智慧耳麥｜智慧型收折靜音麥克風能在收折時完全靜音收納至耳機中緩壓設計｜ProSpecs™ 眼鏡緩壓系統，於接觸位置利用柔軟海綿，友好眼鏡玩家舒適耳罩｜舒適D型耳墊設計，適合長時間配戴玩家使用收音監控｜可透過耳麥聽見自己的聲音並調整音量，隨時注意自身音量廣泛相容｜專為PS4、PS5設計，也可適用於SWITCH、手機、PC等裝置電池續航｜每次充電後就能獲得長達20hr的續航時間，有效應付整天的遊戲需求',
						'price': 4590,
						'url': 'https://24h.pchome.com.tw/prod/DCAYTR-A900B4AZU',
						'image': 'https://e.ecimg.tw/items/DCAYTRA900B4AZU/000001_1639533981.jpg'
				},
				'establisher': 'admin@gmail.com',
				'modifyDate': '2021-12-30 21:59:29.604000',
				'createDate': '2021-12-30 21:59:29.604000'
		},
		{
				'_id': '61ce2bc107db41fdf6b18698',
				'content': {
						'title': 'RAZER 雷蛇 BLACKSHARK V2 PRO黑鯊 V2 PRO虹彩六號 聯名款 無線電競耳機',
						'organizer': 'PCHOME',
						'detail': '1、HyperSpeed Wireless 技術2、TriForce 鈦金屬 50mm 驅動單體3、HyperClear 超心型指向麥克風4、FLOWKNIT 記憶泡綿耳墊',
						'price': 5890,
						'url': 'https://24h.pchome.com.tw/prod/DCBF04-A900BRBMT',
						'image': 'https://e.ecimg.tw/items/DCBF04A900BRBMT/000001_1639562762.jpg'
				},
				'establisher': 'admin@gmail.com',
				'modifyDate': '2021-12-30 21:59:29.670000',
				'createDate': '2021-12-30 21:59:29.670000'
		},
		{
				'_id': '61ce2bc107db41fdf6b18699',
				'content': {
						'title': '羅技 Pro X 專業級電競耳機麥克風',
						'organizer': 'PCHOME',
						'detail': '● BLUE VO!CE 先進麥克風技術● DTS HEADPHONE：X 2.0 7.1聲道環繞音效● 先進的 PRO-G 50mm 單體● 優質耳墊與製造工藝',
						'price': 3990,
						'url': 'https://24h.pchome.com.tw/prod/DCAYF8-A900A63A6',
						'image': 'https://d.ecimg.tw/items/DCAYF8A900A63A6/000001_1620816037.jpg'
				},
				'establisher': 'admin@gmail.com',
				'modifyDate': '2021-12-30 21:59:29.896000',
				'createDate': '2021-12-30 21:59:29.896000'
		},
		{
				'_id': '61ce2bc107db41fdf6b1869a',
				'content': {
						'title': 'G5000 Hi-Res 電競喇叭',
						'organizer': 'PCHOME',
						'detail': 'Hi-Res認證高音質電競喇叭藍牙5.0 aptX HD解碼鈦高音單體 4吋Nomex中低音DSP數位分音',
						'price': 13900,
						'url': 'https://24h.pchome.com.tw/prod/DCAIN7-A900BT4KU',
						'image': 'https://e.ecimg.tw/items/DCAIN7A900BT4KU/000001_1632458169.jpg'
				},
				'establisher': 'admin@gmail.com',
				'modifyDate': '2021-12-30 21:59:29.967000',
				'createDate': '2021-12-30 21:59:29.967000'
		}
		];
		const translatedEvent = selectedEvent && {
			名稱: selectedEvent.content.title,
			建立者: selectedEvent.content.organizer,
			詳情: selectedEvent.content.detail
		};

		return (
			<>
				<FlatList contentContainerStyle={homeStyles.flatList} data={events} renderItem={Event} keyExtractor={event => event._id} numColumns={2} />
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
	flatList: {
		paddingVertical: '5%'
	},
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