import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	container: {
		paddingVertical: '10%',
		alignItems: 'center'
	},
	innerContainer: {
		width: '70%'
	},
	horizontalGroup: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between'
  },
	text: {
		fontSize: 25
	},
	buttonIconSize: 30
});

export default styles;