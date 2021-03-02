import React, {useState, useEffect} from 'react';
import { Button, Overlay } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, TextInput, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, RefreshControl } from 'react-native';
import { Appbar, Avatar, Snackbar } from 'react-native-paper';
import { RectButton } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import DatePicker from '../../components/DatePickerX';
import TimePicker from '../../components/TimePickerX';
import moment from 'moment';
import * as userLib from '../../lib/user'
import ConfigFile from "../../config.json"
import axios from "axios";
import { DatePickerModal, TimePickerModal  } from 'react-native-paper-dates';

const  AlunoAgendar = () => {

  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack()
  }

  const API = axios.create({
      baseURL: ConfigFile.API_SERVER_URL,
    });
  
  type AulaType = { id: number, data: Date, horario: Date};  
  const aulaInitialValue:Array<AulaType> = []
  const dateInitialValue:Date = moment().toDate();
  const timeInitialValue:string = moment().toDate().getHours().toString().padStart(2, '0') + ':' + moment().toDate().getMinutes().toString().padStart(2, '0');
  var horaInicial:Date = dateInitialValue
  horaInicial.setMinutes(0)

  const [overlayVisibility, setoverlayVisibility] = useState(false);
  const [overlayAgendarVisibility, setOverlayAgendarVisibility] = useState(false);
  const [count, setcount] = useState(0);
  const [listAulas, setListAulas] = useState(aulaInitialValue);
  const [actualDateOverlay, setActualDateOverlay] = useState(dateInitialValue);
  const [actualTimeOverlay, setActualTimeOverlay] = useState(timeInitialValue);
  const [actualTimeExactOverlay, setActualTimeExactOverlay] = useState(horaInicial);
  const [valorFinal, setValorFinal] = useState(0);

  const [date, setDate] = React.useState<Date | undefined>(undefined);
  
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

  function dataBonita(time: Date) {    
    return time.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute:'2-digit'
    });
  }

  const addAula = (data: Date, horario: Date) => {    
    setListAulas(listAulas.concat({id: count, data, horario}));
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

    listAulas.map((item, i) => (
      objAulas.aulas.push({
        data: item.data.toISOString().replace(/T.*/,'').split('-').join('-'),
        hora: dataBonita(item.horario)
      })
    ))

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
    const dateSelecionada:Date = moment().toDate();
    dateSelecionada.setHours(hours)
    dateSelecionada.setMinutes(minutes)
    return dateSelecionada
  }

  const calculaValorTotalAgendamento = (): number => {
    if (listAulas.length >= 15)
      return listAulas.length * precoPacote15
    else if (listAulas.length >= 10)
      return listAulas.length * precoPacote10
    else
    return listAulas.length * precoUnitario
  }

  return (
    <KeyboardAvoidingView style={styles.container_principal} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

      <Appbar.Header statusBarHeight={0} style={{ height: 60, backgroundColor: '#212F3C' }}>
        <Appbar.Action icon="arrow-left-circle" size={30} onPress={_goBack} />
        <Appbar.Content title="Agendamento" />
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
                      <Text>{item.data.toLocaleDateString()}</Text>
                    </Text>
                    <Text style={styles.aula_item_text_line}>
                      <Text style={styles.aula_item_text_title}>Horário: </Text>
                      <Text >{dataBonita(item.horario)}</Text>
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
                    <Button onPressOut={()=>setShowDatePicker(true)} title={actualDateOverlay.toLocaleDateString()} />  
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
                      // onChange={} // same props as onConfirm but triggered without confirmed by user
                      // saveLabel="Save" // optional
                      // label="Select date" // optional
                      // animationType="slide" // optional, default is 'slide' on ios/android and 'none' on web
                    />
                    )}                
                </View>
                  
                <View style={styles.overlay_hora}>
                  <Text style={{ fontSize: 18, color: 'white', marginBottom: 10}}>Horário de início</Text>
                  <Button onPressOut={()=>setShowTimePicker(true)} title={dataBonita(actualTimeExactOverlay)} />  
                    {showTimePicker && (
                      <TimePickerModal
                      visible={showTimePicker}
                      onDismiss={ ()=> setShowTimePicker(false) }
                      onConfirm={({ hours, minutes }) => {
                        setShowTimePicker(false);
                        setActualTimeExactOverlay(guardaHorarioSelecionado( hours, minutes));
                      }}
                      hours={actualTimeExactOverlay.getHours()} // default: current hours
                      minutes={0} // default: current minutes
                      label="Selecione o horário de início" // optional, default 'Select time'
                      cancelLabel="Cancelar" // optional, default: 'Cancel'
                      confirmLabel="Ok" // optional, default: 'Ok'
                      animationType="fade" // optional, default is 'none'
                      //locale={'en'} // optional, default is automically detected by your system
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
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 24, paddingTop: 8}} >Solicitar Agendamento</Text>
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
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', }}>
            <RectButton style={styles.buttonNao} onPress={()=> setOverlayAgendarVisibility(false)} >
              <Text style={styles.buttonNaoText}>Não</Text>
            </RectButton>
          </View>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', }}>
            <RectButton style={styles.buttonSim} onPress={()=> AgendarAulas()}>
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
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', }}>
            <RectButton style={styles.buttonNao} onPress={()=> setOverlayRemoverAulaVisibility(false)} >
              <Text style={styles.buttonNaoText}>Não</Text>
            </RectButton>
          </View>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', }}>
            <RectButton style={styles.buttonSimDelete} onPress={()=> removeAula(aulaSelecionadaRemocao)}>
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
    height: 100,
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
    borderWidth: 1
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