import React, {useState, useEffect} from 'react';
import { Button, Overlay } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import { Appbar, Snackbar } from 'react-native-paper';
import { RectButton } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import 'moment/locale/pt-br';
import * as userLib from '../../lib/user'
import ConfigFile from "../../config.json"
import axios from "axios";
import { DatePickerModal, TimePickerModal  } from 'react-native-paper-dates';

const  AlunoAgendar = () => {

  const navigation = useNavigation();

  const _goBack = () => {
    if(listAulas.length == 0)
      navigation.goBack()
    else
    setOverlaySairVisibility(true)
  }

  const confirmouSairSemSalvar = () => {
    setOverlaySairVisibility(false)
    navigation.goBack()
  }

  const API = axios.create({
      baseURL: ConfigFile.API_SERVER_URL,
    });
  
  type AulaType = { id: number, data: Date, horarioInicio: Date, horarioFim: Date};  
  const aulaInitialValue:Array<AulaType> = []
  //10800000 corresponde a 3hr, para descontar no horario e calcular corretamente
  //const dateInitialValue:Date = new Date(Date.now()-10800000)
  const dateInitialValue:Date = new Date()
  var horaInicial:Date = new Date()
  horaInicial.setMinutes(0)

  const [overlayVisibility, setoverlayVisibility] = useState(false);
  const [overlayAgendarVisibility, setOverlayAgendarVisibility] = useState(false);
  const [overlaySairVisibility, setOverlaySairVisibility] = useState(false);
  const [count, setcount] = useState(0);
  const [listAulas, setListAulas] = useState(aulaInitialValue);
  const [actualDateOverlay, setActualDateOverlay] = useState(dateInitialValue);
  const [actualTimeExactOverlay, setActualTimeExactOverlay] = useState(horaInicial);

  const[qtdPendentesReagendamento, setQtdPendentesReagendamento] = useState(0);

  const[minutosDuracaoAula, setMinutosDuracaoAula] = useState(50);
  
  const [aulaSelecionadaRemocao, setAulaSelecionadaRemocao] = useState(0);
  const [overlayRemoverAulaVisibility, setOverlayRemoverAulaVisibility] = useState(false);  

  //Configurações para o DatePicker do Overlay
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [snackMensagemVisible, setSnackMensagemVisible] = React.useState(false);
  const [snackMensagem, setSnackMensagem] = React.useState('');

  const [precoUnitario, setPrecoUnitario] = React.useState(60);
  const [precoPacote10, setPrecoPacote10] = React.useState(50);
  const [precoPacote15, setPrecoPacote15] = React.useState(45);

  const toggleOverlayVisibility = () => {
    setoverlayVisibility(!overlayVisibility);
  };

  const getQtdPendentesReagendamento = async () => {
    try { 
      const { id, token } = JSON.parse(await userLib.getUserAuthData())

      const resp = await API.get('/agendamento/qtdPendentesReagendamento/' + id, {headers: {Authorization: 'Bearer ' + token}})

      if(resp.status == 200)
      {
        setQtdPendentesReagendamento(resp.data.qtdPendentesReagendamento)
      }
   } catch (error) {
     console.log('Não conseguiu carregar qtd aulas reagendamento')
     console.log(error.response.data.error)
     setSnackMensagem(error.response.data.error)
     setSnackMensagemVisible(true)
   } 
 }

  function apresentaHoraBonita(time: Date) {
    var horarioApresentacao = time.toLocaleTimeString('pr-BR', {
      hour: '2-digit',
      minute:'2-digit',
      hour12: false
    })

    //Tratamento especifico pois no Android ficava apresentando os segundos indevidamente
    horarioApresentacao = horarioApresentacao.substring(0, 5)

    return horarioApresentacao
  }

  function apresentaDataBonita(dateRaw: Date) {
    function pad(n:number) {
       return n < 10 ? "0"+n : n;
    }
    
    var result = pad(dateRaw.getDate())+"/"+ pad((dateRaw.getMonth()+1)) +"/"+dateRaw.getFullYear();
    return result
  }

  const addAula = (data: Date, horario: Date) => { 
    console.log('adding: ', data, horario)

    var horarioFimCalculado = new Date(horario)
    if (horarioFimCalculado.getMinutes() + minutosDuracaoAula >= 60) {
      horarioFimCalculado.setHours(horarioFimCalculado.getHours() + 1)
      horarioFimCalculado.setMinutes(horarioFimCalculado.getMinutes() + minutosDuracaoAula - 60)
    } else {
      horarioFimCalculado.setMinutes(horarioFimCalculado.getMinutes() + minutosDuracaoAula)
    }    

    setListAulas(listAulas.concat({id: count, data, horarioInicio: horario, horarioFim: horarioFimCalculado}));
    toggleOverlayVisibility();
    setShowDatePicker(false);
    setShowTimePicker(false);
    setcount(count+1);
  };

  const handleDelete = (id: number) => {
    setOverlayRemoverAulaVisibility(true)
    setAulaSelecionadaRemocao(id)
  }

  const removeAula = (id: number) => {
    var index = listAulas.findIndex(aula => aula.id == id)
    listAulas.splice(index, 1)
    console.log('removendo aula', id)  
    setOverlayRemoverAulaVisibility(false)  
  }

  const AgendarAulas = async () => {

    const { token } = JSON.parse(await userLib.getUserAuthData())

    const objAulas = {
      aulas: []
    };

    listAulas.map((item, i) => {
      console.log('antes: ', item.data)
      console.log('depois: ', item.data.toISOString().replace(/T.*/,'').split('-').join('-'))
      objAulas.aulas.push({
        data: item.data.toISOString().replace(/T.*/,'').split('-').join('-'),
        hora: apresentaHoraBonita(item.horarioInicio)
      })
    })

    console.log(objAulas)

    try {
      const resp = await API.post('/agendamento', 
      objAulas, 
      {
       headers: 
        {
          Authorization: 'Bearer ' + token,
        }
      })

      if(resp.status == 200)
      {
        setOverlayAgendarVisibility(false)
        setSnackMensagem('Aulas agendadas com sucesso!')
        setSnackMensagemVisible(true)                    
      }  

    } catch (error) {
      console.log('Erro ao agendar aulas')
      setSnackMensagem(error.response.data.error)
      setSnackMensagemVisible(true)
    }
  }

  const guardaHorarioSelecionado = (hours: number, minutes: number) : Date => {
    const dateSelecionada:Date = new Date(Date.now())
    dateSelecionada.setHours(hours)
    dateSelecionada.setMinutes(minutes)
/*     console.log('hours: ', hours)
    console.log('minutes: ', minutes) */
    return dateSelecionada
  }

  const calculaValorTotalAgendamento = (): number => {
    if (listAulas.length - qtdPendentesReagendamento >= 15)
      return (listAulas.length - qtdPendentesReagendamento) * precoPacote15
    else if (listAulas.length - qtdPendentesReagendamento >= 10)
      return (listAulas.length - qtdPendentesReagendamento) * precoPacote10
    else
    return (listAulas.length - qtdPendentesReagendamento) * precoUnitario
  }

  useEffect(() => {
    getQtdPendentesReagendamento()  
   
  }, [])

  return (
    <KeyboardAvoidingView style={styles.container_principal} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

      <Appbar.Header statusBarHeight={0} style={{ height: 60, backgroundColor: '#212F3C' }}>
        <Appbar.Action icon="arrow-left-circle" size={30} onPress={_goBack} />
        <Appbar.Content title="Agendamento" style={{alignItems:'center'}}/>
        <Appbar.Action icon="arrow-left-circle" color='#212F3C' size={30}  />
      </Appbar.Header>

      <View style={styles.view_infos}>
        <View style={styles.item_status}>
          <Icon name='coins' size={30} color='white'/>
        </View>
        <View style={styles.item_detalhes}>
          <Text style={styles.item_text_line}>
            <Text style={styles.item_text_title}>Aula Individual: </Text>
            <Text>{precoUnitario} reais</Text>
          </Text>
          <Text style={styles.item_text_line}>
            <Text style={styles.item_text_title}>Pacote com 10 aulas: </Text>
            <Text >{precoPacote10} reais cada</Text>
          </Text>
          <Text style={styles.item_text_line}>
            <Text style={styles.item_text_title}>Pacote com 15 aulas ou mais: </Text>
            <Text >{precoPacote15} reais cada</Text>
          </Text>
          <Text style={styles.item_text_line}>
            <Text style={styles.item_text_title}>Aulas pendente reagendamento: </Text>
            <Text style={{color: qtdPendentesReagendamento > 0 ? '#A3D6D4' : '#fff', fontWeight: qtdPendentesReagendamento > 0 ? 'bold' : 'normal'}}>{qtdPendentesReagendamento}</Text>
          </Text>
          <Text style={styles.item_text_line}>
            <Text style={styles.item_text_suave}>O pagamento não é tratado via aplicativo</Text>
          </Text>
        </View>
      </View>

      <View style={styles.view_aulas}>
        <ScrollView>
          <View style={{flex:1}}> 

            {
              listAulas.map((item, i) => (
          
                <View key={item.id} style={styles.item}>
                  <View style={styles.item_status}>
                    <MaterialIcon name='access-time' size={25} />
                  </View >
                  <View style={styles.aula_item_detalhes}>
                    <Text style={styles.aula_item_text_line}>
                      <Text style={styles.aula_item_text_title}>Data: </Text>
                      <Text>{apresentaDataBonita(item.data)}</Text>
                    </Text>
                    <Text style={styles.aula_item_text_line}>
                      <Text style={styles.aula_item_text_title}>Horário: </Text>
                      <Text >{apresentaHoraBonita(item.horarioInicio)} até {apresentaHoraBonita(item.horarioFim)}</Text>
                    </Text>              
                  </View>
                  <View style={styles.item_action}>
                    <Icon name='trash-alt' size={30} color='red' onPress={()=> {handleDelete(item.id)}}/>
                  </View >
                </View>

              ))
            } 

            <View style={{alignItems: 'center', margin: 10}}>
              <Icon name='plus-circle' size={60} color='green' onPress={toggleOverlayVisibility}/>
              <Overlay isVisible={overlayVisibility} overlayStyle={styles.overlay_add}>
              <>
                <View style={styles.overlay_titulo}>
                  <View style={{flex: 1}}>
                    <MaterialIcon name='arrow-back' size={35} onPress={toggleOverlayVisibility}/>
                  </View>
                  <View style={{flex: 8}}>
                    <Text style={{textAlign: 'center', fontSize: 24, color: 'white'}}>Nova Aula</Text>
                  </View>
                </View>
                
                <View style={styles.overlay_data}>
                  <Text style={{fontSize: 18, color: 'white', marginBottom: 10}}>Data</Text>
                    <Button onPressOut={()=>setShowDatePicker(true)} title={apresentaDataBonita(actualDateOverlay)} />  
                    {showDatePicker && (
                      <DatePickerModal
                      // locale={'en'} optional, default: automatic
                      mode="single"
                      visible={showDatePicker}
                      onDismiss={ ()=> setShowDatePicker(false) }
                      date={actualDateOverlay}
                      onConfirm={ (params) => {
                        setShowDatePicker(false)
                        setActualDateOverlay(params.date);
                      }}                      
                      locale={'pt-BR'} // optional, default is automically detected by your system
                      // onChange={} // same props as onConfirm but triggered without confirmed by user
                       saveLabel="Salvar" // optional
                       label="Selecione a data" // optional
                      // animationType="slide" // optional, default is 'slide' on ios/android and 'none' on web
                    />
                    )}                
                </View>
                  
                <View style={styles.overlay_hora}>
                  <Text style={{ fontSize: 18, color: 'white', marginBottom: 10}}>Horário de início</Text>
                  <Button onPressOut={()=>setShowTimePicker(true)} title={apresentaHoraBonita(actualTimeExactOverlay)} />  
                    {showTimePicker && (
                      <TimePickerModal
                      visible={showTimePicker}
                      onDismiss={ ()=> setShowTimePicker(false) }
                      onConfirm={({ hours, minutes }) => {
                        setShowTimePicker(false);
                        setActualTimeExactOverlay(guardaHorarioSelecionado(hours, minutes));
                      }}
                      minutes={0} // default: current minutes
                      label="Selecione o horário de início" // optional, default 'Select time'
                      cancelLabel="Cancelar" // optional, default: 'Cancel'
                      confirmLabel="Salvar" // optional, default: 'Ok'
                      animationType="fade" // optional, default is 'none'
                      locale={'pt-BR'} // optional, default is automically detected by your system
                    />
                    )}
                </View>

                <View style={styles.overlay_button} onTouchEnd={()=>addAula(actualDateOverlay, actualTimeExactOverlay)}>
                  <Text style={{textAlign: 'center', fontSize: 30, fontWeight: 'bold'}}>Adicionar</Text>
                </View>
              </>
              </Overlay>
             
            </View>
          </View> 
        </ScrollView>
      </View>

      <View style={styles.view_confirmar_button} onTouchEnd={()=> setOverlayAgendarVisibility(true)}>
        <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 24, paddingTop: 8}} >Confirmar Agendamento</Text>
        </View>
        <View style={{flex: 3, flexDirection:'row', paddingBottom: 12}}>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', }}>
            <Text style={{fontSize: 20}}>Quant. Aulas: {listAulas.length}</Text>
          </View>    
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', }}>     
            <Text style={{fontSize: 20}}>Valor: {calculaValorTotalAgendamento()}</Text>
          </View>   
        </View>
      </View>

      <Overlay isVisible={overlayAgendarVisibility} overlayStyle={styles.overlay_agendar}>
      <>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Confirma efetuar os</Text>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>agendamentos?</Text>
        </View>
        <View style={{flex: 1, flexDirection:'row', alignItems: 'center'}}>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', }} onTouchEnd={()=> setOverlayAgendarVisibility(false)}>
            <RectButton style={styles.buttonNao}>
              <Text style={styles.buttonNaoText}>Não</Text>
            </RectButton>
          </View>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', }} onTouchEnd={()=> AgendarAulas()}>
            <RectButton style={styles.buttonSim}>
              <Text style={styles.buttonSimText}>Sim</Text>
            </RectButton>
          </View>
        </View>
      </>
      </Overlay>

      <Overlay isVisible={overlaySairVisibility} overlayStyle={styles.overlay_agendar}>
      <>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Dados não salvos</Text>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Deseja sair?</Text>
        </View>
        <View style={{flex: 1, flexDirection:'row', alignItems: 'center'}}>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', }} onTouchEnd={()=> setOverlaySairVisibility(false)}>
            <RectButton style={styles.buttonNao}>
              <Text style={styles.buttonNaoText}>Não</Text>
            </RectButton>
          </View>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', }} onTouchEnd={()=> confirmouSairSemSalvar()}>
            <RectButton style={styles.buttonSimDelete}>
              <Text style={styles.buttonSimText}>Sim</Text>
            </RectButton>
          </View>
        </View>
      </>
      </Overlay>

      <Overlay isVisible={overlayRemoverAulaVisibility} overlayStyle={styles.overlay_agendar}>
      <>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Confirma remover</Text>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>a aula?</Text>
        </View>
        <View style={{flex: 1, flexDirection:'row', alignItems: 'center'}}>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', }} onTouchEnd={()=> setOverlayRemoverAulaVisibility(false)} >
            <RectButton style={styles.buttonNao} >
              <Text style={styles.buttonNaoText}>Não</Text>
            </RectButton>
          </View>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', }} onTouchEnd={()=> removeAula(aulaSelecionadaRemocao)} >
            <RectButton style={styles.buttonSimDelete} >
              <Text style={styles.buttonSimText}>Sim</Text>
            </RectButton>
          </View>
        </View>
      </>
      </Overlay>

      <Snackbar
        visible={snackMensagemVisible}
        onDismiss={() => setSnackMensagemVisible(false)}
        action={{
          label: 'OK',
          onPress: _goBack,
        }}>
        {snackMensagem}
      </Snackbar>
      
    </KeyboardAvoidingView>

);
}

export default AlunoAgendar;

const styles = StyleSheet.create({
  container_principal: {
    flex: 1,
    backgroundColor: 'black',
    alignContent: 'center',
    paddingTop: 40
  },

  overlay_add: {
    height: 350,
    width: 300,
    borderRadius: 8,
    backgroundColor: '#212F3C',
    
  },
  overlay_timepicker: {
    height: 400,
    width: 350,
    borderRadius: 8
  },

  overlay_titulo:{
    flex: 1,
    flexDirection: 'row'
  },
  overlay_data:{
    flex: 2,
  },
  overlay_hora:{
    flex: 2,
  },
  overlay_button:{
    flex: 1,
    backgroundColor: 'red',
    margin: -10,
    borderBottomStartRadius: 8,
    borderBottomEndRadius: 8,
    justifyContent: 'center'
  },

  view_infos: {
    height: 120,
    margin: 10,
    borderRadius: 8,
    borderColor: '#212F3C',
    borderWidth: 2,
    flexDirection: 'row',
  },

  view_aulas: {
    flex: 18,
    marginHorizontal: 10,
    marginBottom: 10,
  },

  view_confirmar_button: {
    flex: 3,
    backgroundColor: '#34CB79',
  },

  item_status:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  item_detalhes:{
    flex: 4,
    paddingTop: 3,
    paddingBottom: 3,
  },

  item_text_line:{
    flex: 1,
    marginTop: 3,
    color: '#fff'
  },

  item_text_title:{
    flex: 1,
    fontWeight: 'bold'
  },

  item_text_suave:{
    flex: 1,
    color: '#999'
  },

  item:{
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#BBBBBB',
    marginTop: 10,
  },

  item_action:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  buttonSim: {
    backgroundColor: 'green',
    height: 50,
    width: '80%',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    marginStart: '15%',
  },

  buttonSimDelete: {
    backgroundColor: 'red',
    height: 50,
    width: '80%',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    marginStart: '15%',
  },

  buttonSimText: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    marginTop: '12%'
  },

  buttonNao: {
    height: 50,
    width: '80%',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    marginStart: '15%',
    borderWidth: 1,
  },

  buttonNaoText: {
    flex: 1,
    fontSize: 16,
    marginTop: '12%'
  },

  aula_item_detalhes:{
    flex: 4,
  },

  aula_item_text_line:{
    flex: 1,
    marginTop: 1.5,
    marginBottom: 1.5
  },

  aula_item_text_title:{
    flex: 1,
    fontWeight: 'bold'
  },

  overlay_agendar: {
    height: 150,
    width: 250,
    borderRadius: 8,
    alignItems: 'center',
  },

})