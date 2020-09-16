import React, {useState, useEffect} from 'react';
import { Button, Overlay } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, TextInput, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, RefreshControl } from 'react-native';
import { Appbar, Avatar } from 'react-native-paper';
import { RectButton } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import DatePicker from '../../components/DatePickerX';
import TimePicker from '../../components/TimePickerX';
import moment from 'moment';

const  AlunoAgendar = () => {

  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack()
  }

  
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

  const [aulaSelecionadaRemocao, setAulaSelecionadaRemocao] = useState(0);
  const [overlayRemoverAulaVisibility, setOverlayRemoverAulaVisibility] = useState(false);

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

  //Configurações para o DatePicker do Overlay
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  return (
    <KeyboardAvoidingView style={styles.container_principal} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

      <Appbar.Header statusBarHeight={-15} style={{height: 45, backgroundColor: '#212F3C'}}>
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
            <Text>50 reais</Text>
          </Text>
          <Text style={styles.item_text_line}>
            <Text style={styles.item_text_title}>Pacote com 10 aulas: </Text>
            <Text >45 reais cada</Text>
          </Text>
          <Text style={styles.item_text_line}>
            <Text style={styles.item_text_title}>Pacote com 15 aulas: </Text>
            <Text >40 reais cada</Text>
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
                <View style={styles.overlay_titulo}>
                  <View style={{flex: 1}}>
                    <MaterialIcon name='arrow-back' size={25} onPress={toggleOverlayVisibility}/>
                  </View>
                  <View style={{flex: 6}}>
                    <Text style={{textAlign: 'center', fontSize: 18}}>Nova Aula</Text>
                  </View>
                </View>
                
                <View style={styles.overlay_data}>
                  <Text style={{fontSize: 18}}>Data</Text>
                    <Button onPressOut={()=>setShowDatePicker(true)} title={actualDateOverlay.toLocaleDateString()} />  
                    {showDatePicker && (
                      <DatePicker
                        date={actualDateOverlay}
                        onClose={date => {
                          if (date && Platform.OS !== 'iOS') {
                            setShowDatePicker(false)
                          } else {
                            setShowDatePicker(false)
                            setActualDateOverlay(date);
                          }
                          
                        }}
                        onChange={date => {
                          if (date && Platform.OS !== 'iOS') {
                            setActualDateOverlay(date);
                          } else {
                            setActualDateOverlay(date);
                          }
                          
                        }}                     
                      />
                    )}                
                </View>
                  
                <View style={styles.overlay_hora}>
                  <Text style={{ fontSize: 18}}>Horário de início</Text>
                  <Button onPressOut={()=>setShowTimePicker(true)} title={dataBonita(actualTimeExactOverlay)} />  
                    {showTimePicker && (
                      <TimePicker
                        date={actualTimeExactOverlay}
                        onClose={time => {
                          if (time && Platform.OS !== 'iOS') {
                            setShowTimePicker(false)
                          } else {
                            setShowTimePicker(false)
                            setActualTimeExactOverlay(time)
                            //setActualTimeOverlay(moment(time).toDate().getHours().toString().padStart(2, '0') + ':' + moment(time).toDate().getMinutes().toString().padStart(2, '0'));
                          }
                          
                        }}
                        onChange={time => {
                          if (time && Platform.OS !== 'iOS') {
                            setActualTimeExactOverlay(time)
                            //setActualTimeOverlay(moment(time).toDate().getHours().toString().padStart(2, '0') + ':' + moment(time).toDate().getMinutes().toString().padStart(2, '0'));
                          } else {
                            setActualTimeExactOverlay(time)
                            //setActualTimeOverlay(moment(time).toDate().getHours().toString().padStart(2, '0') + ':' + moment(time).toDate().getMinutes().toString().padStart(2, '0'));
                          }
                          
                        }}                     
                      />
                    )}
                </View>

                <View style={styles.overlay_button} onTouchEnd={()=>addAula(actualDateOverlay, actualTimeExactOverlay)}>
                  <Text style={{textAlign: 'center', fontSize: 25}}>Adicionar</Text>
                </View>
             
              </Overlay>
             
            </View>
          </View> 
        </ScrollView>
      </View>

      <View style={styles.view_confirmar_button} onTouchEnd={()=> setOverlayAgendarVisibility(true)}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 5}}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 24}} >Solicitar Agendamento</Text>
        </View>
        <View style={{flex: 1, flexDirection:'row'}}>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', }}>
            <Text style={{fontSize: 18}}>Quant. Aulas: {listAulas.length}</Text>
          </View>    
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', }}>     
            <Text style={{fontSize: 18}}>Valor: {listAulas.length * 50}</Text>
          </View>   
        </View>
      </View>

      <Overlay isVisible={overlayAgendarVisibility} overlayStyle={styles.overlay_agendar}>
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
            <RectButton style={styles.buttonSim} onPress={()=> _goBack()}>
              <Text style={styles.buttonSimText}>Sim</Text>
            </RectButton>
          </View>
        </View>
      </Overlay>

      <Overlay isVisible={overlayRemoverAulaVisibility} overlayStyle={styles.overlay_agendar}>
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
      </Overlay>
      
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
    height: 300,
    width: 250,
    borderRadius: 8
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
    flex: 4,
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