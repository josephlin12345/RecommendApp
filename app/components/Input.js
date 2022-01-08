import { useContext } from 'react';
import { Text, TextInput } from 'react-native';
import { ThemeContext } from './Provider';

export default Input = ({ text, setText, secureTextEntry, textContentType }) => {
  const theme = useContext(ThemeContext);

  return (
    <>
      <Text style={{ color: theme.colors.text, fontSize: 25 }}>{text}</Text>
      <TextInput
        style={{
          color: theme.colors.primary,
          borderColor: theme.colors.text,
          height: 50,
          fontSize: 25,
          borderBottomWidth: 1,
          marginVertical: 30
        }}
        onChangeText={text => setText(text)}
        autoCapitalize={'none'}
        secureTextEntry={secureTextEntry}
        textContentType={textContentType}
      ></TextInput>
    </>
  );
}