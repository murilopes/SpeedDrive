import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  StyleSheet, Text, View, TextInput, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Appbar, Avatar, Snackbar, DefaultTheme, Provider, TextInput as TextInputNativePaper } from 'react-native-paper';
import { Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { RectButton } from 'react-native-gesture-handler';
import ConfigFile from "../../config.json"
import * as userLib from '../../lib/user'
import * as utilLib from '../../lib/util'
import axios from "axios";

interface IAulaDetalhe {
  _id?: string,
  status?: string,
  horarioInicio?: string,
  horarioFim?: string,
  aluno?: IAluno,
}

interface IAluno {
  nome?: string,
  CEP?: string,
  endereco?: string,
  numero?: string,
  complemento?: string,
  bairro?: string,
  cidade?: string,
  estado?: string,
}

const AulaAprovacao = (props: object) => {
  
  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack();
  };
  
  let aulaDetalheVazio: IAulaDetalhe = {}

  const [snackMensagemVisible, setSnackMensagemVisible] = React.useState(false);
  const [snackMensagem, setSnackMensagem] = React.useState('');
  const [objAulaDetalhe, setObjAulaDetalhe] = React.useState(aulaDetalheVazio);

  const [overlayRecusarAulaVisibility, setOverlayRecusarAulaVisibility] = React.useState(false);
  const [motivoRecusaAula, setMotivoRecusaAula] = React.useState('');  
  const [opacityContainerPrincipal, setOpacityContainerPrincipal] = React.useState(1);

  const toggleOverlayRecusarAulaVisibility = () => {
    if (overlayRecusarAulaVisibility) {
      setOverlayRecusarAulaVisibility(false)
      setOpacityContainerPrincipal(1)
    } else {
      setOverlayRecusarAulaVisibility(true)
      setOpacityContainerPrincipal(0.2)
    }
  };

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

  const recusarAula = async () => {

    try {

      const { token } = JSON.parse(await userLib.getUserAuthData())
      const resp = await API.put('/agendamento/recusarAula/' + props.route.params.idAgendamento, 
      {
        'motivo': motivoRecusaAula
      },
      {
        headers: 
        {
          Authorization: 'Bearer ' + token,
        }
      })

      if(resp.status == 200)
      {
        console.log('Instrutor Recusou Aula')

        setTimeout(async () => {
          _goBack()
        }, 3000);

        toggleOverlayRecusarAulaVisibility()

        setSnackMensagem('Aula recusada!')
        setSnackMensagemVisible(true)
      }
    } catch (error) {
      console.log('Erro quando Instrutor Recusou Aula')
      console.log(error.response.data.error)
      setSnackMensagem(error.response.data.error)
      setSnackMensagemVisible(true)
    } 
  }

  const aceitarAula = async () => {

    try {
      
      const { token } = JSON.parse(await userLib.getUserAuthData())

      console.log('/agendamento/aceitarAula/' + props.route.params.idAgendamento)

      const resp = await API.put('/agendamento/aceitarAula/' + props.route.params.idAgendamento, {},
      {
        headers: 
        {
          Authorization: 'Bearer ' + token,
        }
      })

      if(resp.status == 200)
      {
        console.log('Instrutor Aceitou Aula')

        setTimeout(async () => {
          _goBack()
        }, 3000);

        setSnackMensagem('Aula aceita!')
        setSnackMensagemVisible(true)
      }
    } catch (error) {
      console.log('Erro quando Instrutor Aceitou Aula')
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
      background: '#212F3C',
      placeholder: '#A79898',
    },
  };

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
        <Appbar.Content title="Detalhe Aula - Aprovação" />
      </Appbar.Header>

      <View style={{flex: 1, alignItems: 'center', paddingTop: 20, opacity: opacityContainerPrincipal}}>
        
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

          <View style={styles.item}>
            <View style={styles.item_interno}>
              <View style={styles.item_status}>
                <Icon name="user" size={20} />
              </View>
              <View style={styles.item_detalhes}>
                <View style={styles.item_text_superior}>
                  <Text style={styles.item_text_value}>(Não exibido)</Text>
                </View>
                <View style={styles.item_text_inferior}>
                  <Text style={styles.item_text_title}>Aluno</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.item}>
            <View style={styles.item_interno}>
              <View style={styles.item_status}>
                <Icon name="map-signs" size={20} />
              </View>
              <View style={styles.item_detalhes}>
                <View style={styles.item_text_superior}>
                  <Text style={styles.item_text_value}>{objAulaDetalhe.aluno ? objAulaDetalhe.aluno.bairro : ''}</Text>
                </View>
                <View style={styles.item_text_inferior}>
                  <Text style={styles.item_text_title}>Bairro</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.item}>
            <View style={styles.item_interno}>
              <View style={styles.item_status}>
                <Icon name="map" size={20} />
              </View>
              <View style={styles.item_detalhes}>
                <View style={styles.item_text_superior}>
                  <Text style={styles.item_text_value}>{objAulaDetalhe.aluno ? `${objAulaDetalhe.aluno.cidade} / ${objAulaDetalhe.aluno.estado}` : ''}</Text>
                </View>
                <View style={styles.item_text_inferior}>
                  <Text style={styles.item_text_title}>Cidade/Estado</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.item_action}>
          <RectButton style={styles.button_recusar} onPress={() => toggleOverlayRecusarAulaVisibility()}>
            <Text style={styles.button_recusar_text}>Recusar</Text>
          </RectButton>

          <RectButton style={styles.button_aceitar} onPress={() => aceitarAula()}>
            <Text style={styles.button_aceitar_text}>Aceitar</Text>
          </RectButton>
        </View>

        <Overlay isVisible={overlayRecusarAulaVisibility} overlayStyle={styles.overlay_motivo_recusa}>
          <Provider>
            <View style={styles.overlay_motivo_recusa_view_titulo}>
              <View style={{flex: 1}}>
                <MaterialIcon name='arrow-back' size={35} onPress={() => toggleOverlayRecusarAulaVisibility()}/>
              </View>
            </View>
            <View style={styles.overlay_motivo_recusa_view_dados}>          
              <Text style={{fontSize: 16, marginBottom: 15, color: 'white'}} >Por gentileza, descreva  o motivo da recusa da aula</Text>
              <TextInputNativePaper theme={theme} label="Motivo" value={motivoRecusaAula} onChangeText={text => setMotivoRecusaAula(text)}/>
            </View>
                                
            <View style={styles.overlay_motivo_recusa_view_button} onTouchEnd={() => recusarAula()}>
              <Text style={{textAlign: 'center', fontSize: 25, fontWeight: 'bold'}}>Enviar</Text>
            </View>
          </Provider>
        </Overlay>

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

export default AulaAprovacao;

const styles = StyleSheet.create({
  container_principal: {
    flex: 1,
    backgroundColor: 'black',
    alignContent: 'center',
    paddingTop: 40,
  },

  view_items: {
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
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },

  button_recusar: {
    backgroundColor: 'red',
    height: 60,
    width: 140,
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 20,
    alignItems: 'center',
    marginRight: 25
  },

  button_aceitar: {
    backgroundColor: 'green',
    height: 60,
    width: 140,
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 20,
    alignItems: 'center',
    marginLeft: 25
  },

    button_aceitar_text: {
    flex: 1,
    color: '#FFF',
    fontSize: 26,
    marginTop: '10%',    
    fontWeight: 'bold',
  },

   button_recusar_text: {
    flex: 1,
    fontSize: 24,
    marginTop: '10%',
    fontWeight: 'bold',
  },

  overlay_motivo_recusa: {
    height: 250,
    width: 300,
    borderRadius: 8,
    backgroundColor: '#212F3C',
    marginBottom: 70
  },
  
  overlay_motivo_recusa_view_titulo:{
    flex: 1,
    flexDirection: 'row',
  },

  overlay_motivo_recusa_view_dados:{
    flex: 4,
  },
  
  overlay_motivo_recusa_view_button:{
    flex: 1.5,
    backgroundColor: 'red',
    margin: -10,
    borderBottomStartRadius: 8,
    borderBottomEndRadius: 8,
    justifyContent: 'center',  
  },

});
