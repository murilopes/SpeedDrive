import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Appbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import ConfigFile from "../../config.json"
import * as userLib from '../../lib/user'
import * as utilLib from '../../lib/util'
import axios from "axios";

interface INotificacao {
  _id: string,
  titulo?: string,
  mensagem?: string,
  flgLida: boolean,
  createAt: string,
}

const  Notificacoes = (props: object) => {

  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack()
  }

  let NotificacoesVazio: Array<INotificacao> = []

  const [snackMensagemVisible, setSnackMensagemVisible] = React.useState(false);
  const [snackMensagem, setSnackMensagem] = React.useState('');
  const [objArrayNotificacoes, setObjArrayNotificacoes] = React.useState(NotificacoesVazio)

  const API = axios.create({
    baseURL: ConfigFile.API_SERVER_URL,
  });

  const getNotificacoes = async () => {

    try {

      const { id, token, tipoUsuario } = JSON.parse(await userLib.getUserAuthData())
      const resp = await API.get(`/notificacao/${tipoUsuario}/${id}`, 
      {
        headers: 
        {
          Authorization: 'Bearer ' + token,
        }
      })

      if(resp.status == 200)
      {
        console.log('Conseguiu carregar notificacoes do usuario') 
        return  resp.data.notificacoes
      }
    } catch (error) {
      console.log('Não conseguiu carregar notificacoes do usuario')
      console.log(error.response.data.error)
      setSnackMensagem(error.response.data.error)
      setSnackMensagemVisible(true)
    } 
  }

  React.useEffect(() => {
    getNotificacoes().then(
      (notificacoes) => {
        if (notificacoes)
        setObjArrayNotificacoes(notificacoes)
      }
    ) 
  }, [])

  const qtdDiasTexto = (dias?: number): string => {
    if (dias == 0)
      return 'hoje'
    else if (dias == 1)
      return 'ontem'
    else
      return `${dias} dias atrás`
  }

  return (
    <KeyboardAvoidingView style={styles.container_principal} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

      <Appbar.Header statusBarHeight={0} style={{height: 60, backgroundColor: '#212F3C'}}>
        <Appbar.Action icon="arrow-left-circle" size={30} onPress={_goBack} />
        <Appbar.Content  title="Notificações" style={{alignItems:'center'}}/>
        <Appbar.Action icon="arrow-left-circle" color='#212F3C' size={30}  />
      </Appbar.Header>

      <ScrollView>        
        <View style={styles.view_items} >

          {
            objArrayNotificacoes.map((item, i) => (
          
              <View key={item._id} style={styles.item}>
                <View style={styles.item_status}>
                  <View style={styles.item_icon_new}>
                    <Icon name='circle' size={10} color={item.flgLida == true ? '#F1F1F1' : 'green'}/>
                  </View>
                  <View style={styles.item_icon_envelope}>
                    <Icon name={item.flgLida == true ? 'envelope-open' : 'envelope'} size={30} />
                  </View>
                </View >
                <View style={styles.item_detalhes}>
                  <View style={styles.item_titulo}>
                    <>
                      <Text style={styles.item_text_title}>{item.titulo}</Text>
                    </>
                  </View>
                  <View style={styles.item_mensagem}>
                    <Text style={styles.item_text_mensagem}>{item.mensagem}</Text>
                  </View>          
                </View>
                <View style={styles.item_info_dias}>
                  <Text style={styles.item_text_dias}>{qtdDiasTexto(utilLib.retornaQtdDias(item.createAt))}</Text>
                </View >
              </View>
            ))
          }
        </View>
      </ScrollView>
    </KeyboardAvoidingView>

);
}

export default Notificacoes;

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
    height: 80,
    marginTop: 15,
  },

  item_status:{
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },

  item_icon_new: {
    flex: 1,
    alignSelf: 'flex-end',
    paddingRight: 10,
    paddingTop: 10,
  },

  item_icon_envelope: {
    flex: 6,
  },

  item_detalhes:{
    flex: 12,
    justifyContent: 'center'
  },

  item_info_dias:{
    flex: 2,
    paddingRight: 3,
    alignItems: 'flex-end',
  },

  item_text_title:{
    fontWeight: 'bold'
  },

  item_text_mensagem:{
    fontSize: 12,
    color: '#334d4d'
  },

  item_text_dias:{
    fontSize: 12,
    color: '#0066cc'
  },

  item_titulo: {
    flex: 2,
    justifyContent: 'center'
  },

  item_mensagem: {
    flex: 4,
  },
})