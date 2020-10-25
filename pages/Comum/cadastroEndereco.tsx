import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Picker,
  StyleSheet, View,  
} from 'react-native';
import { Appbar, TextInput, DefaultTheme, Text, Snackbar } from 'react-native-paper';
import { TextInputMask } from 'react-native-masked-text'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { RectButton } from 'react-native-gesture-handler';
import * as userLib from '../../lib/user'
import ConfigFile from "../../config.json"
import { IAluno } from '../../interfaces/interfaces'
import axios from "axios";

const cadastroEndereco = (props: object) => {
  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack();
  };

  let alunoVazio: IAluno = {}
  const [objAluno, setObjAluno] = React.useState(alunoVazio)

  const [snackMensagemVisible, setSnackMensagemVisible] = React.useState(false);
  const [snackMensagem, setSnackMensagem] = React.useState('');

  const API = axios.create({
    baseURL: ConfigFile.API_SERVER_URL,
  });

  const SalvarDados = async () => {

    const { token } = JSON.parse(await userLib.getUserAuthData())

    const alunoDadosPessoasData = {
      CEP: objAluno.CEP || '',
      endereco: objAluno.endereco || '',
      numero: objAluno.numero || '',
      complemento: objAluno.complemento || '',
      bairro: objAluno.bairro || '',
      cidade: objAluno.cidade || '',
      estado: objAluno.estado || '',
    };

    try {
      const resp = await API.put('/aluno/alterarEndereco', 
      alunoDadosPessoasData, 
      {
       headers: 
        {
          Authorization: 'Bearer ' + token,
        }
      })

      if(resp.status == 200)
      {
        setSnackMensagem('Dados salvos com sucesso!')
        setSnackMensagemVisible(true)                    
      }  

    } catch (error) {
      console.log('Erro ao salvar dados do Aluno')
      setSnackMensagem(error.response.data.error)
      setSnackMensagemVisible(true)
    }
  }

  React.useEffect(() => {
    let aluno = props.route.params.aluno as IAluno

    setObjAluno(aluno)
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

      <TextInput theme={theme} label="CEP" value={objAluno.CEP} returnKeyType={ 'done' }
        render={props =><TextInputMask
          {...props}
          type={'zip-code'}
          value={objAluno.CEP}
          onChangeText={text => setObjAluno({...objAluno, CEP: text})}
        />}
      />
      <TextInput theme={theme} label="Endereço" value={objAluno.endereco} onChangeText={text => setObjAluno({...objAluno, endereco: text})}/>
      <TextInput theme={theme} label="Número" value={objAluno.numero} onChangeText={text => setObjAluno({...objAluno, numero: text})} keyboardType='numeric' returnKeyType='done'/>
      <TextInput theme={theme} label="Complemento" value={objAluno.complemento} onChangeText={text => setObjAluno({...objAluno, complemento: text})}/>
      <TextInput theme={theme} label="Bairro" value={objAluno.bairro} onChangeText={text => setObjAluno({...objAluno, bairro: text})}/>
      <TextInput theme={theme} label="Cidade" value={objAluno.cidade} onChangeText={text => setObjAluno({...objAluno, cidade: text})}/>
      <TextInput theme={theme} label="Estado" value={objAluno.estado} onChangeText={text => setObjAluno({...objAluno, estado: text})}/>


      <View style={styles.buttonView}>
        <RectButton style={styles.button} onPress={() => SalvarDados()}>
          <Text style={styles.buttonText}>Salvar</Text>
        </RectButton>
      </View>

      <Snackbar
        visible={snackMensagemVisible}
        onDismiss={() => setSnackMensagemVisible(false)}
        action={{
          label: 'OK',
          onPress: _goBack,
        }}>
        {snackMensagem}
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
