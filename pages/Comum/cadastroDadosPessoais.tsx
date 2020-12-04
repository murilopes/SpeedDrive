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
import { IPessoaTelaDadosPessoais } from '../../interfaces/interfaces'
import axios from "axios";

const cadastroDadosPessoais = (props: object) => {
  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack();
  };

  let pessoaVazio: IPessoaTelaDadosPessoais = {}
  const [objPessoa, setObjPessoa] = React.useState(pessoaVazio)

  const [snackMensagemVisible, setSnackMensagemVisible] = React.useState(false);
  const [snackMensagem, setSnackMensagem] = React.useState('');

  const handleSelecaoGenero = (genero: string) => {
    if(genero.includes('Masculino'))
    {
        setObjPessoa({...objPessoa, sexo: objPessoa.sexo == 'M' ? '' : 'M'})   
    }
    else if(genero.includes('Feminino'))
    {
      setObjPessoa({...objPessoa, sexo: objPessoa.sexo == 'F' ? '' : 'F'})   
    }
    else if(genero.includes('Outros'))
    {
      setObjPessoa({...objPessoa, sexo: objPessoa.sexo == 'O' ? '' : 'O'}) 
    }
  }

  const API = axios.create({
    baseURL: ConfigFile.API_SERVER_URL,
  });

  const SalvarDados = async () => {

    const { token, tipoUsuario } = JSON.parse(await userLib.getUserAuthData())

    const pessoaDadosPessoaisData = {
      nome: objPessoa.nome || '',
      sobrenome: objPessoa.sobrenome || '',
      CPF: objPessoa.CPF?.replaceAll('.', '').replaceAll('-', '') || '',
      dataNascimento: utilLib.formataDataFriendlyParaDataSistema(objPessoa.dataNascimentoFormatada) || '',
      whatsapp: objPessoa.whatsapp?.replaceAll(' ', '').replaceAll('(', '').replaceAll(')', '').replaceAll('-', '') || '',
      sexo: objPessoa.sexo || '',
      email: objPessoa.email || '',
      observacoes: objPessoa.observacoes || '',
    };

    try {
      const resp = await API.put(`/${tipoUsuario}/alterarDadosPrincipais`, 
      pessoaDadosPessoaisData, 
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
      console.log('Erro ao salvar dados da Pessoa')
      setSnackMensagem(error.response.data.error)
      setSnackMensagemVisible(true)
    }
  }

  React.useEffect(() => {
    let pessoa = props.route.params.pessoa as IPessoaTelaDadosPessoais
    const dataNascimentoFormatada = utilLib.formataDataParaExibicaoDataFriendly(pessoa.dataNascimento)   

    setObjPessoa({...pessoa, dataNascimentoFormatada})
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
        <Appbar.Content title="Dados Pessoais" />
      </Appbar.Header>

      <TextInput theme={theme} label="Nome" value={objPessoa.nome} onChangeText={text => setObjPessoa({...objPessoa, nome: text})}/>
      
      <TextInput theme={theme} label="Sobrenome" value={objPessoa.sobrenome} onChangeText={text => setObjPessoa({...objPessoa, sobrenome: text})}/>
      
      <Text  style={{color: '#A79898', marginStart: 12, marginTop: 10, marginBottom: 10, fontSize: objPessoa.sexo != '' ? 12 : 16}}>Gênero</Text>
      <View style={{flexDirection: 'row'}}>
        <Chip selected={objPessoa.sexo == 'M'} selectedColor={objPessoa.sexo == 'M' ? 'blue' : 'black'} onPress={() => {handleSelecaoGenero('Masculino')}} style={{width: 110, marginStart: 10, marginEnd: 10}}>Masculino</Chip>
        <Chip selected={objPessoa.sexo == 'F'} selectedColor={objPessoa.sexo == 'F' ? 'blue' : 'black'} onPress={() => {handleSelecaoGenero('Feminino')}} style={{width: 100, marginEnd: 10}}>Feminino</Chip>
        <Chip selected={objPessoa.sexo == 'O'} selectedColor={objPessoa.sexo == 'O' ? 'blue' : 'black'} onPress={() => {handleSelecaoGenero('Outros')}} style={{width: 100}}>Outros</Chip>
      </View>

      <TextInput theme={theme} label="CPF" value={objPessoa.CPF} returnKeyType={ 'done' }
        render={props =><TextInputMask
          {...props}
          type={'cpf'}
          value={objPessoa.CPF}
          onChangeText={text => setObjPessoa({...objPessoa, CPF: text})}
        />}
      />

      <TextInput theme={theme} label="WhatsApp/Celular" value={objPessoa.whatsapp} returnKeyType={ 'done' }
        render={props =><TextInputMask
          {...props}
          type={'cel-phone'}
          options={{
            maskType: 'BRL',
            withDDD: true,
            dddMask: '(99) '
          }}
          value={objPessoa.whatsapp}
          onChangeText={text => setObjPessoa({...objPessoa, whatsapp: text})}
        />}
      />

      <TextInput theme={theme} label="Data de Nascimento" value={objPessoa.dataNascimento} returnKeyType={ 'done' }
        render={props =><TextInputMask
          {...props}
          type={'datetime'}
          options={{format: 'DD/MM/YYYY'}}
          value={objPessoa.dataNascimentoFormatada}
          onChangeText={text => setObjPessoa({...objPessoa, dataNascimentoFormatada: text})}
        />}
      />

      <TextInput theme={theme} label="Email" value={objPessoa.email} onChangeText={text => setObjPessoa({...objPessoa, email: text})} keyboardType='email-address'/>

      {(props.route.params.tipoUsuario == 'aluno') && (<TextInput
                  theme={theme} 
                  label="Observações" 
                  value={objPessoa.observacoes} 
                  placeholder='Ex: preferência de aula com instrutor do mesmo sexo' 
                  onChangeText={text => setObjPessoa({...objPessoa, observacoes: text})}/
      >)}

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

export default cadastroDadosPessoais;

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
