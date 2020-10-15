import React, {useState, useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Appbar, Snackbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RectButton } from 'react-native-gesture-handler';
import ConfigFile from "../../config.json"
import * as userLib from '../../lib/user.ts'
import axios from "axios";

const  AlunoRealizadas = () => {

  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack()
  }
  const _handleAulaDetalheInstrutor = () => {
    navigation.navigate('AulaDetalheInstrutor');
  }

  type AulaRealizada = { id: string, status: string, data: string, horarioInicio: string, horarioFim: string, nomeInstrutor: string}; 
  const arrayInitialValue:Array<AulaRealizada> = []
  
  const [snackMensagemVisible, setSnackMensagemVisible] = React.useState(false);
  const [snackMensagem, setSnackMensagem] = React.useState('');
  const [arrayAulasRealizadas, setArrayAulasRealizadas] = React.useState(arrayInitialValue)

  const API = axios.create({
    baseURL: ConfigFile.API_SERVER_URL,
  });

  const PreencheObjAulasRealizadas = async () => {
    try {
            
      const { id, token } = JSON.parse(await userLib.getUserAuthData())

      var reqData = {
        tipoUsuario: 'aluno',
        idUsuario: id,
      };

      const resp = await API.get('/agendamento/realizadas/' + reqData.idUsuario, 
      {
        headers: 
        {
          Authorization: 'Bearer ' + token,
          tipoUsuario: reqData.tipoUsuario
        }
      })

      if(resp.status == 200)
      {
        console.log('Conseguiu carregar info realizadas')
        
        const arrayResponse = Object.keys(resp.data.aulas).map(i => resp.data.aulas[Number(i)]);
        
        for(const element of arrayResponse) {
          if(arrayAulasRealizadas.some(x => x.id == element._id) == false) {
            console.log('Adicionou', element._id)
            setArrayAulasRealizadas(arrayAulasRealizadas.concat({
              id: element._id,
              status: element.status, 
              data: element.horarioInicio, 
              horarioInicio: element.horarioInicio, 
              horarioFim: element.horarioFim, 
              nomeInstrutor: element.instrutor.nome
            }));
          }            
        }
      }
    } catch (error) {
      console.log('Não conseguiu carregar info realizadas')
      console.log(error.response.data.error)
      setSnackMensagem(error.response.data.error)
      setSnackMensagemVisible(true)
    } 
  }

  PreencheObjAulasRealizadas()

  return (
    <KeyboardAvoidingView style={styles.container_principal} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

      <Appbar.Header statusBarHeight={-15} style={{height: 45, backgroundColor: '#212F3C'}}>
        <Appbar.Action icon="arrow-left-circle" size={30} onPress={_goBack} />
        <Appbar.Content title="Aulas Realizadas" />
      </Appbar.Header>

      <ScrollView>        
        <View style={styles.view_items} >
          
          {
            arrayAulasRealizadas.map((item, i) => (
              <View key={item.id} style={styles.item}>
                <View style={styles.item_status}>
                  <Icon name='circle' size={20} color='#0081DA'/>
                </View>
                <View style={styles.item_detalhes}>
                  <Text style={styles.item_text_line}>
                    <Text style={styles.item_text_title}>Status: </Text>
                    <Text>{item.status}</Text>
                  </Text>
                  <Text style={styles.item_text_line}>
                    <Text style={styles.item_text_title}>Data: </Text>
                    <Text>{item.data.substr(0, 10)}</Text>
                  </Text>
                  <Text style={styles.item_text_line}>
                    <Text style={styles.item_text_title}>Horário início: </Text>
                    <Text>{item.horarioInicio}</Text>
                  </Text>
                  <Text style={styles.item_text_line}>
                    <Text style={styles.item_text_title}>Instrutor: </Text>
                    <Text>{item.nomeInstrutor}</Text>
                  </Text>
                </View>
                <View style={styles.item_action}>
                  <RectButton style={styles.button} onPress={_handleAulaDetalheInstrutor}>
                    <Text style={styles.buttonText}>Detalhe</Text>
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

export default AlunoRealizadas;

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
  },

  item_status:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  item_detalhes:{
    flex: 4,
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
    fontWeight: 'bold'
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