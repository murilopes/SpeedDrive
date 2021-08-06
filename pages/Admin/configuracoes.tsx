import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  StyleSheet, View,  
} from 'react-native';
import { Appbar, TextInput, DefaultTheme, Chip, Text, Snackbar } from 'react-native-paper';
import { TextInputMask } from 'react-native-masked-text'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { RectButton } from 'react-native-gesture-handler';
import * as userLib from '../../lib/user'
import * as utilLib from '../../lib/util'
import ConfigFile from "../../config.json"
import { IEmpresa } from '../../interfaces/interfaces'
import axios from "axios";

const adminConfiguracoes = (props: object) => {
  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack();
  };

  let empresaVazio: IEmpresa = {}
  const [objEmpresa, setObjEmpresa] = React.useState(empresaVazio)

  const [snackMensagemVisible, setSnackMensagemVisible] = React.useState(false);
  const [snackMensagem, setSnackMensagem] = React.useState('');

  const API = axios.create({
    baseURL: ConfigFile.API_SERVER_URL,
  });

  const removeCaracteresIndesajados = async (texto: String|undefined) => {
    if (texto != undefined)
      return texto.replace('.', '').replace('-', '').replace(' ', '').replace('(', '').replace(')', '')
    else 
      return ''
  }

  const SalvarDados = async () => {

    const { token, tipoUsuario } = JSON.parse(await userLib.getUserAuthData())

    const configuracoesEmpresaData = await {
      valorAulaUnitario: objEmpresa.valorAulaUnitario,
      valor6Aulas: objEmpresa.valor6Aulas,
      valor10Aulas: objEmpresa.valor10Aulas,
    };

    console.log(configuracoesEmpresaData)

    try {
      const resp = await API.put(`/empresa/alteraValoresAula/60e517b4cfe23a0013cbd824`, 
      configuracoesEmpresaData, 
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
      console.log('Erro ao salvar dados configurações empresa')
      setSnackMensagem(error.response.data.error)
      setSnackMensagemVisible(true)
    }
  }

  
  const getEmpresa = async () => {

    try {

      const { id, token } = JSON.parse(await userLib.getUserAuthData())
      const resp = await API.get('/empresa/60e517b4cfe23a0013cbd824', 
      {
        headers: 
        {
          Authorization: 'Bearer ' + token,
        }
      })

      if(resp.status == 200)
      {
        console.log('Conseguiu carregar empresa')
        return  resp.data.empresa
      }
    } catch (error) {
      console.log('Não conseguiu carregar empresa')
      console.log(error.response.data.error)
      setSnackMensagem(error.response.data.error)
      setSnackMensagemVisible(true)
    } 
  }

  React.useEffect(() => {
    getEmpresa().then(
      (empresa) => {
        if (empresa)
          setObjEmpresa(empresa)
        console.log(empresa)
      }
    ) 
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
        <Appbar.Content title="Configurações" style={{alignItems:'center'}}/>
        <Appbar.Action icon="arrow-left-circle" color='#212F3C' size={30}  />
      </Appbar.Header>

      <TextInput theme={theme} label="Razão social" value={objEmpresa.razaoSocial} onChangeText={text => setObjEmpresa({...objEmpresa, razaoSocial: text})}/>
      <TextInput theme={theme} label="Nome fantasia" value={objEmpresa.nomeFantasia} onChangeText={text => setObjEmpresa({...objEmpresa, nomeFantasia: text})}/>
      <TextInput theme={theme} label="CNPJ" value={objEmpresa.CNPJ} onChangeText={text => setObjEmpresa({...objEmpresa, CNPJ: text})}/>
      <TextInput theme={theme} label="Telefone" value={objEmpresa.telefone} onChangeText={text => setObjEmpresa({...objEmpresa, telefone: text})}/>
      <TextInput theme={theme} label="E-mail" value={objEmpresa.email} onChangeText={text => setObjEmpresa({...objEmpresa, email: text})}/>
      <TextInput theme={theme} label="Endereço" value={objEmpresa.endereco} onChangeText={text => setObjEmpresa({...objEmpresa, endereco: text})}/>
      <TextInput theme={theme} label="Latitude" value={objEmpresa.latitude?.toString()} onChangeText={text => setObjEmpresa({...objEmpresa, latitude: text})}/>
      <TextInput theme={theme} label="Longitude" value={objEmpresa.longitude?.toString()} onChangeText={text => setObjEmpresa({...objEmpresa, longitude: text})}/>
      <TextInput theme={theme} label="Valor aula unitária" value={objEmpresa.valorAulaUnitario?.toString()} onChangeText={text => setObjEmpresa({...objEmpresa, valorAulaUnitario: text})}/>
      <TextInput theme={theme} label="Valor pacote 6 aulas" value={objEmpresa.valor6Aulas?.toString()} onChangeText={text => setObjEmpresa({...objEmpresa, valor6Aulas: text})}/>
      <TextInput theme={theme} label="Valor pacote 10 aulas" value={objEmpresa.valor10Aulas?.toString()} onChangeText={text => setObjEmpresa({...objEmpresa, valor10Aulas: text})}/>
      
    
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

export default adminConfiguracoes;

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
