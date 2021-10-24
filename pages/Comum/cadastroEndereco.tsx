import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Picker,
  StyleSheet, View,  
} from 'react-native';
import { Appbar, TextInput, DefaultTheme, Text, Snackbar } from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown'
import { TextInputMask } from 'react-native-masked-text'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { RectButton } from 'react-native-gesture-handler';
import * as userLib from '../../lib/user'
import * as utilLib from '../../lib/util'
import ConfigFile from "../../config.json"
import { IPessoa } from '../../interfaces/interfaces'
import axios from "axios";

const cadastroEndereco = (props: object) => {
  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack();
  };

  let pessoaVazio: IPessoa = {}
  const [objPessoa, setObjPessoa] = React.useState(pessoaVazio)

  const [snackMensagemVisible, setSnackMensagemVisible] = React.useState(false);
  const [snackMensagem, setSnackMensagem] = React.useState('');
  
  const [showDropDownEstado, setShowDropDownEstado] = React.useState(false);

  const API = axios.create({
    baseURL: ConfigFile.API_SERVER_URL,
  });

  const SalvarDados = async () => {

    const { token, tipoUsuario } = JSON.parse(await userLib.getUserAuthData())

    const pessoaDadosPessoasData = {
      CEP: objPessoa.CEP || '',
      endereco: objPessoa.endereco || '',
      numero: objPessoa.numero || '',
      complemento: objPessoa.complemento || '',
      bairro: objPessoa.bairro || '',
      cidade: objPessoa.cidade || '',
      estado: objPessoa.estado || '',
    };

    try {
      const resp = await API.put(`/${tipoUsuario}/alterarEndereco`, 
      pessoaDadosPessoasData, 
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
      console.log('Erro ao salvar dados do Pessoa')
      setSnackMensagem(error.response.data.error)
      setSnackMensagemVisible(true)
    }
  }

  const BuscaCEP = async () => {

    try {
      const cep = objPessoa.CEP
      const resp = await API.get(`https://viacep.com.br/ws/${cep}/json/`)
      if(resp.status == 200 && !resp.data.erro)
      {
        setObjPessoa({
          ...objPessoa,
          endereco: resp.data.logradouro,
          bairro: resp.data.bairro,
          cidade: resp.data.localidade,
          estado: resp.data.uf,
        })
      }  
    } catch (error) {
    }

  }

  React.useEffect(() => {
    let pessoa = props.route.params.pessoa as IPessoa

    setObjPessoa(pessoa)
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
      <Appbar.Header statusBarHeight={0} style={{ height: 60, backgroundColor: '#212F3C' }}>
        <Appbar.Action icon="arrow-left-circle" size={30} onPress={_goBack} />
        <Appbar.Content  title="Endereço" style={{alignItems:'center'}}/>
        <Appbar.Action icon="arrow-left-circle" color='#212F3C' size={30}  />
      </Appbar.Header>

      <TextInput theme={theme} label="CEP" value={objPessoa.CEP} returnKeyType={ 'done' } onBlur={BuscaCEP}
        render={props =><TextInputMask
          {...props}
          type={'zip-code'}
          value={objPessoa.CEP}
          onChangeText={text => setObjPessoa({...objPessoa, CEP: text})}
        />}
      />
      <TextInput theme={theme} label="Endereço" value={objPessoa.endereco} onChangeText={text => setObjPessoa({...objPessoa, endereco: text})}/>
      <TextInput theme={theme} label="Número" value={objPessoa.numero} onChangeText={text => setObjPessoa({...objPessoa, numero: text})} keyboardType='numeric' returnKeyType='done'/>
      <TextInput theme={theme} label="Complemento" value={objPessoa.complemento} onChangeText={text => setObjPessoa({...objPessoa, complemento: text})}/>
      <TextInput theme={theme} label="Bairro" value={objPessoa.bairro} onChangeText={text => setObjPessoa({...objPessoa, bairro: text})}/>
      <TextInput theme={theme} label="Cidade" value={objPessoa.cidade} onChangeText={text => setObjPessoa({...objPessoa, cidade: text})}/>
      <DropDown
        theme={theme}
        label={'Estado'}
        mode={'flat'}
        value={objPessoa.estado}
        setValue={text => setObjPessoa({...objPessoa, estado: text.toString()})}
        list={utilLib.estadoList}
        visible={showDropDownEstado}
        showDropDown={() => setShowDropDownEstado(true)}
        onDismiss={() => setShowDropDownEstado(false)}
        inputProps={{
          right: <TextInput.Icon name={'menu-down'} />,
        }}
      />

      {/* O botao de salvar soh aparece se nao for acesso atraves de impersonate */}
      {(props.route.params.idAlunoImpersonate == null) &&
        <View style={styles.buttonView}>
          <RectButton style={styles.button} onPress={() => SalvarDados()}>
            <Text style={styles.buttonText}>Salvar</Text>
          </RectButton>
        </View>
      }

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
