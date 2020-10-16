import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  StyleSheet, View, KeyboardAvoidingView, Platform,  
} from 'react-native';
import { Appbar, TextInput, DefaultTheme, Chip, Text, Snackbar } from 'react-native-paper';
import { TextInputMask } from 'react-native-masked-text'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { RectButton } from 'react-native-gesture-handler';

/* 
ToDos:
- Trazer dados reais/consistir
*/

const cadastroEndereco = () => {
  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack();
  };

  const [CEP, setCEP] = React.useState('');
  const [endereco, setEndereco] = React.useState('');
  const [numero, setNumero] = React.useState('');
  const [complemento, setComplemento] = React.useState('');  
  const [bairro, setBairro] = React.useState('');
  const [cidade, setCidade] = React.useState('');
  const [estado, setEstado] = React.useState('');

  const [snackSalvarVisible, setSnackSalvarVisible] = React.useState(false);
  const onToggleSnackSalvar = () => setSnackSalvarVisible(!snackSalvarVisible);


  React.useEffect(() => {

  }, [])

  const theme = {
    ...DefaultTheme,
    dark: false,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: '#B70A0A',
      accent: '#212F3C',
      text: 'white',
      surface: 'white',
      background: 'black',
      placeholder: '#A79898',
    },
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container_principal}
    >
      <Appbar.Header statusBarHeight={0} style={{ height: 45, backgroundColor: '#212F3C' }}>
        <Appbar.Action icon="arrow-left-circle" size={30} onPress={_goBack} />
        <Appbar.Content title="Endereço" />
      </Appbar.Header>

      <TextInput theme={theme} label="CEP" value={CEP} onChangeText={text => setCEP(text)}/>
      <TextInput theme={theme} label="Endereço" value={endereco} onChangeText={text => setEndereco(text)}/>
      <TextInput theme={theme} label="Número" value={numero} onChangeText={text => setNumero(text)}/>
      <TextInput theme={theme} label="Complemento" value={complemento} onChangeText={text => setComplemento(text)}/>
      <TextInput theme={theme} label="Bairro" value={bairro} onChangeText={text => setBairro(text)}/>
      <TextInput theme={theme} label="Cidade" value={cidade} onChangeText={text => setCidade(text)}/>
      <TextInput theme={theme} label="Estado" value={estado} onChangeText={text => setEstado(text)}/>


      <View style={styles.buttonView}>
        <RectButton style={styles.button} onPress={onToggleSnackSalvar}>
          <Text style={styles.buttonText}>Salvar</Text>
        </RectButton>
      </View>

      <Snackbar
        visible={snackSalvarVisible}
        onDismiss={onToggleSnackSalvar}
        action={{
          label: 'Ok',
          onPress: _goBack,
        }}>
        Dados salvos com sucesso!
      </Snackbar>
        
    </KeyboardAwareScrollView>
  );
};

export default cadastroEndereco;

const styles = StyleSheet.create({
  container_principal: {
    flex: 1,
    backgroundColor: 'black',
    alignContent: 'center',
    paddingTop: 40,
  },

  buttonView: {
    margin: 15,
    alignItems: 'center'
  },

  button: {
    backgroundColor: '#0081DA',
    height: 45,
    width: '50%',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },

  buttonText: {
    flex: 1,
    color: '#FFF',
    fontSize: 20,
  },
});
