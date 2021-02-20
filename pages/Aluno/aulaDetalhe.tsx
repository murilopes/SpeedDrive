import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  StyleSheet, Text, View, TextInput, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Appbar, Avatar, Snackbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import ConfigFile from "../../config.json"
import * as userLib from '../../lib/user'
import * as utilLib from '../../lib/util'
import axios from "axios";

interface IAulaDetalhe {
  _id?: string,
  status?: string,
  horarioInicio?: string,
  horarioFim?: string,
  valor?: string,
  instrutor?: IInstrutor,
}

interface IInstrutor {
  nome?: string,
  sobrenome?: string,
  dataNascimento?: string,
  marcaVeiculo?: string,
  modeloVeiculo?: string,
  urlFotoPerfil?: string,
}

const AulaDetalhe = (props: object) => {
  
  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack();
  };
  
  let aulaDetalheVazio: IAulaDetalhe = {}

  const [snackMensagemVisible, setSnackMensagemVisible] = React.useState(false);
  const [snackMensagem, setSnackMensagem] = React.useState('');
  const [objAulaDetalhe, setObjAulaDetalhe] = React.useState(aulaDetalheVazio)

  const API = axios.create({
    baseURL: ConfigFile.API_SERVER_URL,
  });

  const getAulaDetalhe = async () => {

    try {

      const { token } = JSON.parse(await userLib.getUserAuthData())
      const resp = await API.get('/agendamento/detalhe/' + props.route.params.idAgendamento, 
      {
        headers: 
        {
          Authorization: 'Bearer ' + token,
        }
      })

      if(resp.status == 200)
      {
        console.log('Conseguiu carregar detalhe da aula') 
        return  resp.data.aula
      }
    } catch (error) {
      console.log('Não conseguiu carregar detalhe da aula')
      console.log(error.response.data.error)
      setSnackMensagem(error.response.data.error)
      setSnackMensagemVisible(true)
    } 
  }

  React.useEffect(() => {
    getAulaDetalhe().then(
      (aulaDetalhe) => {
        if (aulaDetalhe)
        setObjAulaDetalhe(aulaDetalhe)
      }
    ) 
  }, [])

  const textoValorAula = (valor: string) => {
    if (valor != "0")
      return `${valor} reais`
    else if (valor == "0")
      return `${valor} reais (aula remarcada)`
    else
      return ''
  }
  

  return (
    <KeyboardAvoidingView
      style={styles.container_principal}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >

      <Appbar.Header statusBarHeight={0} style={{ height: 60, backgroundColor: '#212F3C' }}>
        <Appbar.Action icon="arrow-left-circle" size={30} onPress={_goBack} />
        <Appbar.Content title="Detalhe Aula" />
      </Appbar.Header>

      <View style={styles.view_principal}>
        <View style={styles.view_instrutor}>

          <View style={styles.view_intrutor_foto}>
            <Avatar.Image
              size={150}
              source={{ uri: objAulaDetalhe.instrutor?.urlFotoPerfil ? objAulaDetalhe.instrutor.urlFotoPerfil : ConfigFile.URL_IMAGEM_NAO_ENCONTRADA }}
              style={{ marginTop: 15, marginBottom: 15 }}
            />
          </View>
          <View style={styles.view_intrutor_detalhe}>
            <View style={styles.view_instrutor_detalhe_interno}>
              <Text style={styles.instrutor_titulo}>Instrutor:</Text>
              <Text style={styles.instrutor_info_principal}>{objAulaDetalhe.instrutor ? objAulaDetalhe.instrutor?.nome : 'Não definido'} {utilLib.retornaUltimoNome(objAulaDetalhe.instrutor?.sobrenome)}</Text>
              <Text style={styles.instrutor_info_secundaria}>{objAulaDetalhe.instrutor?.dataNascimento ? `${utilLib.retornaIdade(objAulaDetalhe.instrutor?.dataNascimento)} anos` : ''}</Text>
              <Text style={styles.instrutor_info_secundaria}>{objAulaDetalhe.instrutor?.marcaVeiculo} {objAulaDetalhe.instrutor?.modeloVeiculo}</Text>
            </View>
          </View>
        </View>

        <View style={styles.view_items}>

          <View style={styles.item}>
            <View style={styles.item_interno}>
              <View style={styles.item_status}>
                <Icon name="calendar" size={20} />
              </View>
              <View style={styles.item_detalhes}>
                <View style={styles.item_text_superior}>
                  <Text style={styles.item_text_value}>{ objAulaDetalhe.horarioInicio ? utilLib.formataDataParaExibicaoDataFriendly(objAulaDetalhe.horarioInicio) : ''}</Text>
                </View>
                <View style={styles.item_text_inferior}>
                  <Text style={styles.item_text_title}>Data</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.item}>
            <View style={styles.item_interno}>
              <View style={styles.item_status}>
                <IconMaterial name="timer" size={20} />
              </View>
              <View style={styles.item_detalhes}>
                <View style={styles.item_text_superior}>
                  <Text style={styles.item_text_value}>{ objAulaDetalhe.horarioInicio ? utilLib.formataDataParaExibicaoHorarioFriendly(objAulaDetalhe.horarioInicio) : ''}</Text>
                </View>
                <View style={styles.item_text_inferior}>
                  <Text style={styles.item_text_title}>Horário início</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.item}>
            <View style={styles.item_interno}>
              <View style={styles.item_status}>
                <IconMaterial name="timer-off" size={20} />
              </View>
              <View style={styles.item_detalhes}>
                <View style={styles.item_text_superior}>
                  <Text style={styles.item_text_value}>{ objAulaDetalhe.horarioFim ? utilLib.formataDataParaExibicaoHorarioFriendly(objAulaDetalhe.horarioFim) : ''}</Text>
                </View>
                <View style={styles.item_text_inferior}>
                  <Text style={styles.item_text_title}>Horário fim</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.item}>
            <View style={styles.item_interno}>
              <View style={styles.item_status}>
                <IconMaterial name="currency-usd" size={20} />
              </View>
              <View style={styles.item_detalhes}>
                <View style={styles.item_text_superior}>
                  <Text style={styles.item_text_value}>{objAulaDetalhe.valor ? textoValorAula(objAulaDetalhe.valor) : ''}</Text>
                </View>
                <View style={styles.item_text_inferior}>
                  <Text style={styles.item_text_title}>Valor</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.item}>
            <View style={styles.item_interno}>
              <View style={styles.item_status}>
                <Icon name="rocket" size={20} />
              </View>
              <View style={styles.item_detalhes}>
                <View style={styles.item_text_superior}>
                  <Text style={styles.item_text_value}>{objAulaDetalhe.status}</Text>
                </View>
                <View style={styles.item_text_inferior}>
                  <Text style={styles.item_text_title}>Status</Text>
                </View>
              </View>
            </View>
          </View>

        </View>

        {/* <View style={styles.item_action}>
          <RectButton style={styles.button} onPress={_handleAulaDetalheInstrutor}>
            <Text style={styles.buttonText}>Cancelar Aula</Text>
          </RectButton>
        </View> */}

        <Snackbar
          visible={snackMensagemVisible}
          onDismiss={() => setSnackMensagemVisible(false)}
          action={{
            label: 'OK',
            onPress: () => {},
          }}>
          {snackMensagem}
        </Snackbar>

      </View>
    </KeyboardAvoidingView>
  );
};

export default AulaDetalhe;

const styles = StyleSheet.create({
  container_principal: {
    flex: 1,
    backgroundColor: 'black',
    alignContent: 'center',
    paddingTop: 40,
  },
  view_principal: {
    flex: 1,
    alignItems: 'center',
  },

  view_instrutor: {
    flex: 3,
    flexDirection: 'row',
    width: '95%',
    marginTop: 15,
    alignItems: 'center',
  },

  view_intrutor_foto: {
    flex: 9,
    alignItems: 'center',
  },

  view_intrutor_detalhe: {
    flex: 11,
    justifyContent: 'center',
    marginLeft: 20,
  },

  view_instrutor_detalhe_interno: {
    height: '55%',
  },

  instrutor_titulo: {
    flex: 1,
    color: '#738396',
    fontSize: 20,
    fontWeight: 'bold',
  },

  instrutor_info_principal: {
    flex: 1,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },

  instrutor_info_secundaria: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },

  view_items: {
    flex: 7,
    alignItems: 'center',
  },

  item: {
    flexDirection: 'row',
    width: '90%',
    height: 70,
    alignItems: 'center',
  },

  item_interno: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F1F1F1',
    height: '90%',
  },

  item_status: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  item_detalhes: {
    flex: 5,
  },

  item_text_superior: {
    flex: 1,
    paddingTop: 10,

  },

  item_text_inferior: {
    flex: 1,
    paddingBottom: 10,
  },

  item_text_title: {
    flex: 1,
    fontSize: 14,
  },

  item_text_value: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
  },

  item_action: {
    flex: 3,
    width: '100%',
    alignItems: 'center',
  },

  button: {
    backgroundColor: '#0081DA',
    height: '30%',
    width: '50%',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 20,
  },

  buttonText: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    marginTop: '8%',
  },
});
