import { useContext } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import styles from '../styles';
import { ThemeContext } from './Provider';

const Input = ({ label, value, setText, secureTextEntry }) => {
  const theme = useContext(ThemeContext);

  return (
    <>
      <Text style={[styles.text, { color: theme.colors.text }]}>{label}</Text>
      <TextInput
        style={[styles.text, inputStyles.textInput, { color: theme.colors.primary, borderColor: theme.colors.text }]}
        value={value}
        onChangeText={text => setText(text)}
        autoCapitalize={'none'}
        secureTextEntry={secureTextEntry}
      ></TextInput>
    </>
  );
}

const inputStyles = StyleSheet.create({
  textInput: {
    height: 50,
    borderBottomWidth: 1,
    marginVertical: 30
  }
});

export default Input;