import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Dimensions, StyleSheet, View, Text, ScrollView, SafeAreaView
} from 'react-native';
import { Appbar, Chip, Provider, Snackbar, DefaultTheme, TextInput as TextInputNativePaper,  } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/FontAwesome';
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

interface IAgendamentosAgrupados {
  aulas: string,
  countInstrutoresAptos: string,
  instrutores?: IInstrutor[]
}

interface IAgendamentos {
  agendamentosPendentes?: IAgendamentosPendentes[],
  agendamentosAgrupados?: IAgendamentosAgrupados
}

const AgendamentosPendentesAluno = (props: object) => {
  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack();
  };  

  let agendamentoVazio: IAgendamentos = {}

  const [arrayAgendamentos, setArrayAgendamentos] = React.useState(agendamentoVazio)
  
  const [count, setCount] = React.useState(0)
  const [snackMensagemVisible, setSnackMensagemVisible] = React.useState(false);
  const [snackMensagem, setSnackMensagem] = React.useState('');

  const _handleAgendamentosRotearAula = (agendamentosPendentes: IAgendamentosPendentes[]) => {
    navigation.navigate('AgendamentosRotearAula', {agendamentosPendentes});
  };

  const API = axios.create({
    baseURL: ConfigFile.API_SERVER_URL,
  });

  const getRoteamentosPendentes = async () => {

    try {

      const { id, token } = JSON.parse(await userLib.getUserAuthData())
      const resp = await API.get('/agendamento/roteamentosPendentesPorAlunoAgrupado/' + props.route.params.idAluno, 
      {
        headers: 
        {
          Authorization: 'Bearer ' + token,
        }
      })

      if(resp.status == 200)
      {
        console.log('Conseguiu carregar roteamentos pendentes aluno')
        return  resp.data.agendamentos
      }
    } catch (error) {
      console.log('Não conseguiu carregar roteamentos pendentes aluno')
      console.log(error.response.data.error)
      setSnackMensagem(error.response.data.error)
      setSnackMensagemVisible(true)
    } 
  }

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

   navigation.addListener('focus', () => {
     setCount(count+1)
   })

  React.useEffect(() => {
    getRoteamentosPendentes().then(
      (agendamentos) => {
        setArrayAgendamentos(agendamentos)
        console.log(agendamentos)
      }
    )

  }, [count])
  
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

  return (
    <KeyboardAwareScrollView
      style={styles.container_principal}
    >
      <Appbar.Header statusBarHeight={0} style={{ height: 60, backgroundColor: '#212F3C' }}>
        <Appbar.Action icon="arrow-left-circle" size={30} onPress={_goBack} />
        <Appbar.Content title="Roteamentos Pendentes" style={{alignItems:'center'}}/>
        <Appbar.Action icon="arrow-left-circle" color='#212F3C' size={30}  />
      </Appbar.Header>

      <View>

        <View style={styles.view_infos}>
          <View style={styles.item_icon}>
            <Icon name='clipboard' size={30} color='white'/>
          </View>
          <View style={styles.item_detalhes}>
            <Text style={styles.item_text_line}>
              <Text style={styles.item_text_disclaimer}>O sistema indica se há algum instrutor com disponibilidade para atender à todas as aulas solicitadas</Text>
            </Text>                  
          </View>
        </View>

        <View style={styles.view_items_todas} >
        
          <View style={styles.item_todas}>
            <View style={styles.item_status}>
              <Icon name='circle' size={30} color='#F7C700'/>
            </View>
            <View style={styles.item_detalhes}>
              <Text style={styles.item_text_line}>
                <Text style={styles.item_text_title}>Todas as aulas</Text>
              </Text>
              <Text style={styles.item_text_line}>
                <Text>{`Instrutores aptos: ${arrayAgendamentos.agendamentosAgrupados?.countInstrutoresAptos ?? 0}`}</Text>
              </Text>           
            </View>
            {(arrayAgendamentos.agendamentosAgrupados?.countInstrutoresAptos ?? 0 > 0) &&
              <View style={styles.item_action}>
                <RectButton style={styles.button} onPress={() => {}}>
                  <Text style={styles.buttonText}>Rotear</Text>
                </RectButton>
              </View >
            }
          </View>

        </View>

        <ScrollView>        
          <View style={styles.view_items} >
          
          {
            arrayAgendamentos.agendamentosPendentes?.map((item, i) => (
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
                    <Text style={styles.item_text_title}>Instrutores aptos: </Text>
                    <Text>{(item.instrutores?.length)}</Text>
                  </Text>
                </View>
                <View style={styles.item_action}>
                  <RectButton style={styles.button} onPress={() => _handleAgendamentosRotearAula(new Array(item))}>
                    <Text style={styles.buttonText}>Rotear</Text>
                  </RectButton>
                </View >
              </View>
            ))
          }

          </View>
        </ScrollView>

      </View>

      <Snackbar style={{marginTop: 40}}
          visible={snackMensagemVisible}
          onDismiss={() => setSnackMensagemVisible(false)}
          action={{
            label: 'OK',
            onPress: () => {},
          }}>
          {snackMensagem}
        </Snackbar>

    </KeyboardAwareScrollView>
  );
};

export default AgendamentosPendentesAluno;

const styles = StyleSheet.create({
  container_principal: {
    flex: 1,
    backgroundColor: 'black',
    alignContent: 'center',
    paddingTop: 40,
  },
    
  button: {
    backgroundColor: '#0081DA',
    height: 40,
    width: '70%',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginStart: '15%',
  },

  buttonText: {
    flex: 1,
    color: '#FFF',
    fontSize: 20,
    paddingTop: 5
  },
  
  view_infos: {
    flex: 4,
    margin: 10,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 8,
    borderColor: '#212F3C',
    borderWidth: 2,
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 10
  },
  
  item_icon:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  item_detalhes:{
    flex: 4,
  },

  item_text_line:{
    flex: 1,
    marginTop: 1.5,
    marginBottom: 1.5
  },

  item_text_disclaimer:{
    flex: 1,
    color: 'white'
  },

  view_items_todas: {
    flex: 5,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },

  view_items: {
    flex: 5,
    alignItems: 'center',
    width: '100%',
  },

  item_todas:{
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F1F1F1',
    width: '95%',
    marginTop: 5,
    paddingTop: 10,
    paddingBottom: 10,
  },  

  item:{
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F1F1F1',
    width: '95%',
    marginTop: 5,
    paddingTop: 4,
    paddingBottom: 4,
  },  

  item_status:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  item_text_title:{
    flex: 1,
    fontWeight: 'bold'
  },

  item_action:{
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },

});
