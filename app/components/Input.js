import { useContext } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import { ThemeContext } from './Provider';

export default Input = ({ text, setText, secureTextEntry }) => {
  const theme = useContext(ThemeContext);

  return (
    <>
      <Text style={{ color: theme.colors.text, ...styles.text }}>{text}</Text>
      <TextInput
        style={{
          color: theme.colors.primary,
          borderColor: theme.colors.text,
          ...styles.textInput
        }}
        onChangeText={text => setText(text)}
        autoCapitalize={'none'}
        secureTextEntry={secureTextEntry}
      ></TextInput>
    </>
  );
}

const styles = StyleSheet.create({
  text: {
		fontSize: 25,
		width: '70%'
	},
	textInput: {
		width: '70%',
		height: 50,
		fontSize: 25,
		borderBottomWidth: 1,
		margin: 30
	}
});