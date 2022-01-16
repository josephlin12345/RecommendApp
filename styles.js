import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	container: {
		width: '70%',
		justifyContent: 'space-between'
	},
	scrollView: {
		paddingVertical: '10%',
		alignItems: 'center'
	},
	horizontalGroup: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
		marginVertical: 30
  },
	text: {
		fontSize: 25
	},
	buttonIconSize: 30
});

export default styles;