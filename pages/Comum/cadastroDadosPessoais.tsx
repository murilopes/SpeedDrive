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
import { IAlunoTelaDadosPessoais } from '../../interfaces/interfaces'
import axios from "axios";

const cadastroDadosPessoais = (props: object) => {
  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack();
  };

  let alunoVazio: IAlunoTelaDadosPessoais = {}
  const [objAluno, setObjAluno] = React.useState(alunoVazio)

  const [snackMensagemVisible, setSnackMensagemVisible] = React.useState(false);
  const [snackMensagem, setSnackMensagem] = React.useState('');

  const handleSelecaoGenero = (genero: string) => {
    if(genero.includes('Masculino'))
    {
        setObjAluno({...objAluno, sexo: objAluno.sexo == 'M' ? '' : 'M'})   
    }
    else if(genero.includes('Feminino'))
    {
      setObjAluno({...objAluno, sexo: objAluno.sexo == 'F' ? '' : 'F'})   
    }
    else if(genero.includes('Outros'))
    {
      setObjAluno({...objAluno, sexo: objAluno.sexo == 'O' ? '' : 'O'}) 
    }
  }

  const API = axios.create({
    baseURL: ConfigFile.API_SERVER_URL,
  });

  const SalvarDados = async () => {

    const { token } = JSON.parse(await userLib.getUserAuthData())

    const alunoDadosPessoasData = {
      nome: objAluno.nome || '',
      sobrenome: objAluno.sobrenome || '',
      CPF: objAluno.CPF?.replaceAll('.', '').replaceAll('-', '') || '',
      dataNascimento: utilLib.formataDataFriendlyParaDataSistema(objAluno.dataNascimentoFormatada) || '',
      whatsapp: objAluno.whatsapp?.replaceAll(' ', '').replaceAll('(', '').replaceAll(')', '').replaceAll('-', '') || '',
      sexo: objAluno.sexo || '',
      email: objAluno.email || '',
      observacoes: objAluno.observacoes || '',
    };

    try {
      const resp = await API.put('/aluno/alterarDadosPrincipais', 
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
    let aluno = props.route.params.aluno as IAlunoTelaDadosPessoais
    const dataNascimentoFormatada = utilLib.formataDataParaExibicaoDataFriendly(aluno.dataNascimento)

    setObjAluno({...aluno, dataNascimentoFormatada})
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

      <TextInput theme={theme} label="Nome" value={objAluno.nome} onChangeText={text => setObjAluno({...objAluno, nome: text})}/>
      
      <TextInput theme={theme} label="Sobrenome" value={objAluno.sobrenome} onChangeText={text => setObjAluno({...objAluno, sobrenome: text})}/>
      
      <Text  style={{color: '#A79898', marginStart: 12, marginTop: 10, marginBottom: 10, fontSize: objAluno.sexo != '' ? 12 : 16}}>Gênero</Text>
      <View style={{flexDirection: 'row'}}>
        <Chip selected={objAluno.sexo == 'M'} selectedColor={objAluno.sexo == 'M' ? 'blue' : 'black'} onPress={() => {handleSelecaoGenero('Masculino')}} style={{width: 110, marginStart: 10, marginEnd: 10}}>Masculino</Chip>
        <Chip selected={objAluno.sexo == 'F'} selectedColor={objAluno.sexo == 'F' ? 'blue' : 'black'} onPress={() => {handleSelecaoGenero('Feminino')}} style={{width: 100, marginEnd: 10}}>Feminino</Chip>
        <Chip selected={objAluno.sexo == 'O'} selectedColor={objAluno.sexo == 'O' ? 'blue' : 'black'} onPress={() => {handleSelecaoGenero('Outros')}} style={{width: 100}}>Outros</Chip>
      </View>

      <TextInput theme={theme} label="CPF" value={objAluno.CPF} returnKeyType={ 'done' }
        render={props =><TextInputMask
          {...props}
          type={'cpf'}
          value={objAluno.CPF}
          onChangeText={text => setObjAluno({...objAluno, CPF: text})}
        />}
      />

      <TextInput theme={theme} label="WhatsApp/Celular" value={objAluno.whatsapp} returnKeyType={ 'done' }
        render={props =><TextInputMask
          {...props}
          type={'cel-phone'}
          options={{
            maskType: 'BRL',
            withDDD: true,
            dddMask: '(99) '
          }}
          value={objAluno.whatsapp}
          onChangeText={text => setObjAluno({...objAluno, whatsapp: text})}
        />}
      />

      <TextInput theme={theme} label="Data de Nascimento" value={objAluno.dataNascimento} returnKeyType={ 'done' }
        render={props =><TextInputMask
          {...props}
          type={'datetime'}
          options={{format: 'DD/MM/YYYY'}}
          value={objAluno.dataNascimentoFormatada}
          onChangeText={text => setObjAluno({...objAluno, dataNascimentoFormatada: text})}
        />}
      />

      <TextInput theme={theme} label="Email" value={objAluno.email} onChangeText={text => setObjAluno({...objAluno, email: text})}/>

      <TextInput  theme={theme} 
                  label="Observações" 
                  value={objAluno.observacoes} 
                  placeholder='Ex: preferência de aula com instrutor do mesmo sexo' 
                  onChangeText={text => setObjAluno({...objAluno, observacoes: text})}/
      >

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
