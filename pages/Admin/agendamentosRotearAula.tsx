import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Appbar, Avatar, Snackbar } from 'react-native-paper';
import { RectButton } from 'react-native-gesture-handler';
import ConfigFile from "../../config.json"
import * as userLib from '../../lib/user'
import * as utilLib from '../../lib/util'
import axios from "axios";

interface IInstrutor {
  _id: string,
  nome: string,
  sobrenome: string,
  urlFotoPerfil: string,
  whatsapp: string,
}

interface IAgendamentosPendentes {
  _id: string,
  horarioInicio: string,
  horarioFim: string,
  status: string,
  instrutores?: IInstrutor[]
}

const AgendamentoRotearAula = (props: object) => {

  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack()
  }

  const [snackMensagemVisible, setSnackMensagemVisible] = React.useState(false);
  const [snackMensagem, setSnackMensagem] = React.useState('');
  const [arrayAgendamentos, setArrayAgendamentos] = React.useState(Array<IAgendamentosPendentes>())

  const API = axios.create({
    baseURL: ConfigFile.API_SERVER_URL,
  });

  const getArrayAgendamentos = async () => {

    try {           
      return props.route.params.agendamentosPendentes
      
    } catch (error) {
      console.log('Não conseguiu preencher array agendamentos')
    } 
  }

  const RotearAulaParaInstrutor = async (idInstrutor: string) => {

    const { token } = JSON.parse(await userLib.getUserAuthData())

    let verificouErro = false

    arrayAgendamentos.forEach(async element => {
      const roteamento =  {
        idAgendamento: element._id,
        idInstrutor: idInstrutor,  
      };
  
      try {
        const resp = await API.put(`/agendamento/rotearAula`, 
        roteamento, 
        {
         headers: 
          {
            Authorization: 'Bearer ' + token,
          }
        })
  
        if(resp.status == 200)
        {
          console.log(`Roteou aula ${element._id} com sucesso!`)
        }  
  
      } catch (error) {
        console.log(`Erro ao rotear aula ${element._id}!`)
        verificouErro = true        
      }
    });

    const message = !verificouErro ? 'Aula(s) roteada(s) com sucesso!' : 'Falha ao rotear aula(s)'
    setSnackMensagem(message) 
    setSnackMensagemVisible(true)    
  }

  useEffect(() => {
    getArrayAgendamentos().then(
      (arrayAgendamentos) => {
        if (arrayAgendamentos)
        setArrayAgendamentos(arrayAgendamentos)
      }
    ) 
  }, [])
  
  return (
    <KeyboardAvoidingView style={styles.container_principal} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

      <Appbar.Header statusBarHeight={0} style={{height: 60, backgroundColor: '#212F3C'}}>
        <Appbar.Action icon="arrow-left-circle" size={30} onPress={_goBack} />        
        <Appbar.Content  title="Rotear para Instrutor" style={{alignItems:'center'}}/>
        <Appbar.Action icon="arrow-left-circle" color='#212F3C' size={30}  />
        
      </Appbar.Header>

      <ScrollView>        
        <View style={styles.view_items} >
          
          {
            arrayAgendamentos[0]?.instrutores?.map((item, i) => (
              <View key={item._id} style={styles.item}>
                <View style={styles.item_status}>
                  <Avatar.Image 
                    size={55} 
                    source={{uri: item.urlFotoPerfil ? item.urlFotoPerfil : ConfigFile.URL_IMAGEM_NAO_ENCONTRADA}}
                  />
                </View>
                
                <View style={styles.item_detalhes}>
                  <Text style={styles.item_text_line}>
                    <Text style={styles.item_text_title}>{item.nome} {utilLib.retornaUltimoNome(item?.sobrenome)}</Text>
                  </Text>
                  <Text style={styles.item_text_line}>
                    <Text style={styles.item_text_sub}>Whatsapp: </Text>
                    <Text>{(item.whatsapp)}</Text>
                  </Text>
                  
                </View>
                <View style={styles.item_action}>
                  <RectButton style={styles.button} onPress={() => RotearAulaParaInstrutor(item._id)}>
                    <Text style={styles.buttonText}>Selecionar</Text>
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

export default AgendamentoRotearAula;

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
    fontSize: 20
  },

  item_text_sub:{
    flex: 1,
    fontWeight: 'bold',
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