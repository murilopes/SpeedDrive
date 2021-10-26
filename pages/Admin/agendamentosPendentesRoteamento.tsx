import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Appbar, Avatar, Snackbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { RectButton } from 'react-native-gesture-handler';
import ConfigFile from "../../config.json"
import * as userLib from '../../lib/user'
import * as utilLib from '../../lib/util'
import axios from "axios";

interface IAluno {
  _id: string,
  nomeCompleto: string,
  count: string
}

const  AgendamentosPendentesRoteamento = () => {

  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack()
  }

  const [count, setCount] = React.useState(0)
  const [snackMensagemVisible, setSnackMensagemVisible] = React.useState(false);
  const [snackMensagem, setSnackMensagem] = React.useState('');
  const [arrayAlunos, setArrayAlunos] = React.useState(Array<IAluno>())

  const _handleAgendamentosPendentesPorAluno = (idAluno: string, nomeAluno: string) => {
    navigation.navigate('AgendamentosPendentesAluno', {idAluno, nomeAluno});
  };

  const API = axios.create({
    baseURL: ConfigFile.API_SERVER_URL,
  });

  const getListaAlunos = async () => {

    try {            
      const { id, token } = JSON.parse(await userLib.getUserAuthData())

      const resp = await API.get('/agendamento/roteamentosPendentes/', 
      {
        headers: 
        {
          Authorization: 'Bearer ' + token,
        }
      })

      if(resp.status == 200)
      {
        console.log('Conseguiu carregar lista agendamentos agrupados alunos')     
        console.log(resp)   
        const arrayAlunos:Array<IAluno> = resp.data.agendamentosAgrupados
        const arrayAlunosNomesNaoNulos = arrayAlunos.filter(x => x.nomeCompleto.trim().length > 0)
        
        return arrayAlunosNomesNaoNulos
      }
    } catch (error) {
      console.log('Não conseguiu carregar lista agendamentos agrupados alunos')
      console.log(error.response.data.error)
      setSnackMensagem(error.response.data.error)
      setSnackMensagemVisible(true)
    } 
  }

  navigation.addListener('focus', () => {
    setCount(count+1)
  })

  useEffect(() => {
    getListaAlunos().then(
      (listaAlunos) => {
        if (listaAlunos)
        setArrayAlunos(listaAlunos)
      }
    ) 
  }, [count])
  
  return (
    <KeyboardAvoidingView style={styles.container_principal} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

      <Appbar.Header statusBarHeight={0} style={{height: 60, backgroundColor: '#212F3C'}}>
        <Appbar.Action icon="arrow-left-circle" size={30} onPress={_goBack} />        
        <Appbar.Content  title="Pendentes roteamento" style={{alignItems:'center'}}/>
        <Appbar.Action icon="arrow-left-circle" color='#212F3C' size={30}  />
        
      </Appbar.Header>

      <ScrollView>        
        <View style={styles.view_items} >
          
          {
            arrayAlunos.map((item, i) => (
              <View key={item._id} style={styles.item}>
                <View style={styles.item_status}>
                  <Icon name= 'user' color = 'grey' size={30} style={{flex: 1}} />
                </View>
                
                <View style={styles.item_detalhes}>
                  <Text style={styles.item_text_line}>
                    <Text style={styles.item_text_title}>{item.nomeCompleto}</Text>
                  </Text>
                  <Text style={styles.item_text_line}>
                    <Text >{`${item.count} aula(s) pendentes`}</Text>
                  </Text>
                  
                </View>
                <View style={styles.item_action}>
                  <RectButton style={styles.button} onPress={() => _handleAgendamentosPendentesPorAluno(item._id, item.nomeCompleto)}>
                    <Text style={styles.buttonText}>Ver</Text>
                  </RectButton>
                </View >
              </View>
            ))
          }

        </View>
      </ScrollView>

      <Snackbar
        visible={snackMensagemVisible}
        onDismiss={() => setSnackMensagemVisible(false)}
        action={{
          label: 'OK',
          onPress: () => {},
        }}>
        {snackMensagem}
      </Snackbar>

    </KeyboardAvoidingView>

  );
}

export default AgendamentosPendentesRoteamento;

const styles = StyleSheet.create({
  container_principal: {
    flex: 1,
    backgroundColor: 'black',
    alignContent: 'center',
    paddingTop: 40
  },

  view_items:{
    flex: 1,
    alignItems: 'center',
  },

  item:{
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F1F1F1',
    width: '95%',
    marginTop: 15,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
  },

  item_status:{
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },

  item_detalhes:{
    flex: 5,
  },

  item_action:{
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },

  item_text_line:{
    flex: 1,
    marginTop: 1.5,
    marginBottom: 1.5
  },

  item_text_title:{
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14
  },

  button: {
    backgroundColor: '#0081DA',
    height: 40,
    width: '70%',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    marginStart: '15%',
  },

  buttonText: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    marginTop: '10%'
  },
})