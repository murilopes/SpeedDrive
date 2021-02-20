import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  StyleSheet, Text, View, TextInput, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Appbar, Avatar, DefaultTheme, Provider, Snackbar,  TextInput as TextInputNativePaper } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ConfigFile from "../../config.json"
import * as userLib from '../../lib/user'
import * as utilLib from '../../lib/util'
import axios from "axios";
import { RectButton } from 'react-native-gesture-handler';
import moment from 'moment';
import { Overlay } from 'react-native-elements';

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

const AulaDetalhe = (props: object) => {
  
  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack();
  };
  
  let aulaDetalheVazio: IAulaDetalhe = {}

  const [snackMensagemVisible, setSnackMensagemVisible] = React.useState(false);
  const [snackMensagemCancelamentoInvalidoVisible, setSnackMensagemCancelamentoInvalidoVisible] = React.useState(false);
  const [snackMensagem, setSnackMensagem] = React.useState('');
  const [objAulaDetalhe, setObjAulaDetalhe] = React.useState(aulaDetalheVazio)
  const [motivoCancelamento, setMotivoCancelamento] = React.useState('')

  const [overlayCancelarVisibility, setOverlayCancelarVisibility] = React.useState(false);

  const [overlayMotivoCancelamentoAulaVisibility, setOverlayMotivoCancelamentoAulaVisibility] = React.useState(false);
  const [opacityContainerPrincipal, setOpacityContainerPrincipal] = React.useState(1);

  const toggleOverlaMotivoCancelamentoAulaVisibility = () => {
    if (overlayMotivoCancelamentoAulaVisibility) {
      setOverlayMotivoCancelamentoAulaVisibility(false)
      setOpacityContainerPrincipal(1)
    } else {
      setOverlayMotivoCancelamentoAulaVisibility(true)
      setOpacityContainerPrincipal(0.2)
    }
  };

  const verificaSePodecancelarAula = () => {
    let bPodeCancelar = false;

    if(objAulaDetalhe.horarioInicio) {

      var horarioInicioAula = new Date(objAulaDetalhe.horarioInicio)
      var horarioMaximoCancelamentoAula = moment(horarioInicioAula).add(-1, 'days').hours(22)
      var horarioAgora = moment()
      console.log('Horario maximo cancelamento aula: ', horarioMaximoCancelamentoAula)
      console.log('Horario agora: ', horarioAgora)
      
      bPodeCancelar = horarioAgora < horarioMaximoCancelamentoAula
      console.log('Pode cancelar aula: ', bPodeCancelar)
    }

    if (bPodeCancelar) {
      toggleOverlaMotivoCancelamentoAulaVisibility()
    } else
    {
      setSnackMensagem('Cancelamento permitido até as 22h do dia anterior do agendamento. Em caso de imprevisto, contate diretamente a SpeedDrive.')
      setSnackMensagemCancelamentoInvalidoVisible(true)
    }

  }

  const validaMotivoCancelamento = (): boolean => {
    if (motivoCancelamento != '' && motivoCancelamento != undefined)
      return true
    else
      return false
  }

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

  const CancelarAula = async () => {

    if(validaMotivoCancelamento() == false)
    {
      setSnackMensagem('Insira um motivo')
      setSnackMensagemVisible(true)
      return;
    }

    const { token, tipoUsuario } = JSON.parse(await userLib.getUserAuthData())

    const bodyData = {
      tipoUsuario,
      motivo: motivoCancelamento
    };

    try {
      const resp = await API.put(`/agendamento/cancelarAula/${objAulaDetalhe._id}`, 
      bodyData, 
      {
       headers: 
        {
          Authorization: 'Bearer ' + token,
        }
      })

      if(resp.status == 200)
      {
        setTimeout(async () => {
          _goBack()
        }, 3000);

        toggleOverlaMotivoCancelamentoAulaVisibility()
        setSnackMensagem('Aula cancelada com sucesso!')
        setSnackMensagemVisible(true)                    
      }  

    } catch (error) {
      console.log('Erro ao cancelar Aula')
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
        <Appbar.Content title="Detalhe Aula" />
      </Appbar.Header>
      <ScrollView>
        <View style={styles.view_principal}>
          
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
                    <Text style={styles.item_text_value}>{objAulaDetalhe.aluno ? objAulaDetalhe.aluno.nome : ''}</Text>
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
                  <Icon name="map-marker" size={20} />
                </View>
                <View style={styles.item_detalhes}>
                  <View style={styles.item_text_superior}>
                    <Text style={styles.item_text_value}>{objAulaDetalhe.aluno ? objAulaDetalhe.aluno.CEP : ''}</Text>
                  </View>
                  <View style={styles.item_text_inferior}>
                    <Text style={styles.item_text_title}>CEP</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.item}>
              <View style={styles.item_interno}>
                <View style={styles.item_status}>
                  <Icon name="road" size={20} />
                </View>
                <View style={styles.item_detalhes}>
                  <View style={styles.item_text_superior}>
                    <Text style={styles.item_text_value}>{objAulaDetalhe.aluno ? `${objAulaDetalhe.aluno.endereco}, ${objAulaDetalhe.aluno.numero} - ${objAulaDetalhe.aluno.complemento}` : ''}</Text>
                  </View>
                  <View style={styles.item_text_inferior}>
                    <Text style={styles.item_text_title}>Endereço</Text>
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

          {(objAulaDetalhe.status == 'Pend. Confirmação' || objAulaDetalhe.status == 'Confirmada' || objAulaDetalhe.status == 'Reagendada') && (
          <View style={styles.item_action}>
            <RectButton style={styles.button} onPress={() => verificaSePodecancelarAula()}>
              <Text style={styles.buttonText}>Cancelar Aula</Text>
            </RectButton>
          </View>
          )}

          <Overlay isVisible={overlayMotivoCancelamentoAulaVisibility} overlayStyle={styles.overlay_motivo_recusa}>
            <Provider>
              <View style={styles.overlay_motivo_recusa_view_titulo}>
                <View style={{flex: 1}}>
                  <MaterialIcon name='arrow-back' size={35} onPress={() => toggleOverlaMotivoCancelamentoAulaVisibility()}/>
                </View>
              </View>
              <View style={styles.overlay_motivo_recusa_view_dados}>          
                <Text style={{fontSize: 16, marginBottom: 15, color: 'white'}} >Por gentileza, descreva  o motivo do cancelamento da aula</Text>
                <TextInputNativePaper theme={theme} label="Motivo" value={motivoCancelamento} onChangeText={text => setMotivoCancelamento(text)}/>
              </View>
                                  
              <View style={styles.overlay_motivo_recusa_view_button} onTouchEnd={() => CancelarAula()}>
                <Text style={{textAlign: 'center', fontSize: 25, fontWeight: 'bold'}}>Enviar</Text>
              </View>
            </Provider>
          </Overlay>

          <Snackbar
            visible={snackMensagemVisible}
            duration={7000}
            onDismiss={() => setSnackMensagemVisible(false)}
            action={{
              label: 'OK',
              onPress: _goBack,
            }}>
            {snackMensagem}
          </Snackbar>

          <Snackbar
            visible={snackMensagemCancelamentoInvalidoVisible}
            duration={20000}
            onDismiss={() => setSnackMensagemCancelamentoInvalidoVisible(false)}
            action={{
              label: 'OK',
              onPress: () => {},
            }}>
            {snackMensagem}
          </Snackbar>

        </View>
      </ScrollView>
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
    paddingTop: 20
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
    width: '100%',
    alignItems: 'center',
  },

  button: {
    backgroundColor: '#0081DA',
    height: 50,
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
