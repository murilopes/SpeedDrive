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
import axios from "axios";

export interface IVeiculo {
  _id?: string,
  marcaVeiculo?: string,
  modeloVeiculo?: string,
  anoFabricacaoVeiculo?: string,
}

const cadastroVeiculo = (props: object) => {
  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack();
  };

  let veiculoVazio: IVeiculo = {}
  const [objVeiculo, setObjVeiculo] = React.useState(veiculoVazio)

  const [snackMensagemVisible, setSnackMensagemVisible] = React.useState(false);
  const [snackMensagem, setSnackMensagem] = React.useState('');

  const API = axios.create({
    baseURL: ConfigFile.API_SERVER_URL,
  });

  const SalvarDados = async () => {

    const { token } = JSON.parse(await userLib.getUserAuthData())

    const veiculoData = {
      marcaVeiculo: objVeiculo.marcaVeiculo || '',
      modeloVeiculo: objVeiculo.modeloVeiculo || '',
      anoFabricacaoVeiculo: objVeiculo.anoFabricacaoVeiculo || '',

    };

    try {
      const resp = await API.put(`/instrutor/alterarVeiculo`, 
      veiculoData, 
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
      console.log('Erro ao salvar dados do Veiculo')
      setSnackMensagem(error.response.data.error)
      setSnackMensagemVisible(true)
    }
  }

  React.useEffect(() => {
    let veiculo = props.route.params.pessoa as IVeiculo

    setObjVeiculo(veiculo)
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
        <Appbar.Content title="Dados do Veículo" />
      </Appbar.Header>

      <TextInput theme={theme} label="Marca" value={objVeiculo.marcaVeiculo} onChangeText={text => setObjVeiculo({...objVeiculo, marcaVeiculo: text})}/>
      <TextInput theme={theme} label="Modelo" value={objVeiculo.modeloVeiculo} onChangeText={text => setObjVeiculo({...objVeiculo, modeloVeiculo: text})}/>
      <TextInput theme={theme} label="Ano de Fabricacao" value={objVeiculo.anoFabricacaoVeiculo} onChangeText={text => setObjVeiculo({...objVeiculo, anoFabricacaoVeiculo: text})}/>

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

export default cadastroVeiculo;

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
