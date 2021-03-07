import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Appbar, Snackbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RectButton } from 'react-native-gesture-handler';
import ConfigFile from "../../config.json"
import * as userLib from '../../lib/user'
import * as utilLib from '../../lib/util'
import axios from "axios";

interface IAula {
  _id: string,
  horarioInicio: string,
  horarioFim: string,
  status: string,
  instrutor: IInstrutor,
}

interface IInstrutor {
  nome: string
}

const  AlunoProximas = () => {

  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack()
  }
  const _handleAulaDetalheInstrutor = (idAgendamento: string) => {
    navigation.navigate('AulaDetalheInstrutor', {idAgendamento});
  }

  const [snackMensagemVisible, setSnackMensagemVisible] = React.useState(false);
  const [snackMensagem, setSnackMensagem] = React.useState('');
  const [arrayAulasProximas, setArrayAulasProximas] = React.useState(Array<IAula>())
  const [count, setCount] = React.useState(0)

  const corStatus = (status: string) => {
    switch (status) {
      case 'Remarcada':
        return '#000000'
      case 'Cancelada':
        return '#C80000'
      case 'Pend. Confirmação':
        return '#F7C700'
      case 'Confirmada':
        return '#00AA4E'
      case 'Realizada':
        return '#0081DA'
      default:
        return '#000000'        
    }
  }

  const API = axios.create({
    baseURL: ConfigFile.API_SERVER_URL,
  });

  const getAulasProximas = async () => {

    try {            
      const { id, token } = JSON.parse(await userLib.getUserAuthData())

      var reqData = {
        idUsuario: id,
      };

      const resp = await API.get('/agendamento/proximas/' + reqData.idUsuario, 
      {
        headers: 
        {
          Authorization: 'Bearer ' + token,
        }
      })

      if(resp.status == 200)
      {
        console.log('Conseguiu carregar info proximas')        
        const arrayAulas:Array<IAula> = resp.data.aulas
        return arrayAulas
      }
    } catch (error) {
      console.log('Não conseguiu carregar info proximas')
      console.log(error.response.data.error)
      setSnackMensagem(error.response.data.error)
      setSnackMensagemVisible(true)
    } 
  }

  navigation.addListener('focus', () => {
    setCount(count+1)
  })

  useEffect(() => {
    getAulasProximas().then(
      (aulasProximas) => {
        if (aulasProximas)
        setArrayAulasProximas(aulasProximas)
      }
    ) 
  }, [count])
  
  return (
    <KeyboardAvoidingView style={styles.container_principal} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

      <Appbar.Header statusBarHeight={0} style={{height: 60, backgroundColor: '#212F3C'}}>
        <Appbar.Action icon="arrow-left-circle" size={30} onPress={_goBack}/>
        <Appbar.Content title="Próximas Aulas" style={{alignItems:'center'}}/>
        <Appbar.Action icon="arrow-left-circle" color='#212F3C' size={30}/>        
      </Appbar.Header>

      <ScrollView>        
        <View style={styles.view_items} >
          
          {
            arrayAulasProximas.map((item, i) => (
              <View key={item._id} style={styles.item}>
                <View style={styles.item_status}>
                  <Icon name='circle' size={20} color={item.status ? corStatus(item.status)  : 'black'}/>
                </View>
                <View style={styles.item_detalhes}>
                  <Text style={styles.item_text_line}>
                    <Text style={styles.item_text_title}>Status: </Text>
                    <Text>{item.status ? item.status : ''}</Text>
                  </Text>
                  <Text style={styles.item_text_line}>
                    <Text style={styles.item_text_title}>Data: </Text>
                    <Text>{ item.horarioInicio ? utilLib.formataDataParaExibicaoDataFriendly(item.horarioInicio) : ''}</Text>
                  </Text>
                  <Text style={styles.item_text_line}>
                    <Text style={styles.item_text_title}>Horário início: </Text>
                    <Text>{ item.horarioInicio ? utilLib.formataDataParaExibicaoHorarioFriendly(item.horarioInicio) : ''}</Text>
                  </Text>
                  <Text style={styles.item_text_line}>
                    <Text style={styles.item_text_title}>Instrutor: </Text>
                    <Text>{(item.instrutor) ? item.instrutor.nome: 'Não definido'}</Text>
                  </Text>
                </View>
                <View style={styles.item_action}>
                  <RectButton style={styles.button} onPress={() => _handleAulaDetalheInstrutor(item._id)}>
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

export default AlunoProximas;

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