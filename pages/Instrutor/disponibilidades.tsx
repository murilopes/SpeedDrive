import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Dimensions, StyleSheet, View, Text, ScrollView
} from 'react-native';
import { Appbar, Chip, Provider, Snackbar, DefaultTheme, TextInput as TextInputNativePaper,  } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { RectButton } from 'react-native-gesture-handler';
import * as userLib from '../../lib/user'
import ConfigFile from "../../config.json"
import axios from "axios";
import { Overlay } from 'react-native-elements';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { TextInputMask } from 'react-native-masked-text'
import DropDown from 'react-native-paper-dropdown'

interface IDisponibilidade {
  _id?: string,
  diaSemana?: string,
  horaInicio?: string,
  horaFim?: string
}

const disponibilidadesInstrutor = () => {
  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack();
  };  
  
  const [count, setCount] = React.useState(0)
  const [snackMensagemVisible, setSnackMensagemVisible] = React.useState(false);
  const [snackMensagem, setSnackMensagem] = React.useState('');

  const disponibilidadeVazio:Array<IDisponibilidade> = []

  const [disponibilidadesDomingo, setDisponibilidadesDomingo] = React.useState(disponibilidadeVazio);
  const [disponibilidadesSegunda, setDisponibilidadesSegunda] = React.useState(disponibilidadeVazio);
  const [disponibilidadesTerca, setDisponibilidadesTerca] = React.useState(disponibilidadeVazio);
  const [disponibilidadesQuarta, setDisponibilidadesQuarta] = React.useState(disponibilidadeVazio);
  const [disponibilidadesQuinta, setDisponibilidadesQuinta] = React.useState(disponibilidadeVazio);
  const [disponibilidadesSexta, setDisponibilidadesSexta] = React.useState(disponibilidadeVazio);
  const [disponibilidadesSabado, setDisponibilidadesSabado] = React.useState(disponibilidadeVazio);
  
  const [overlayAdicionarVisibility, setOverlayAdicionarVisibility] = React.useState(false);  
  const [opacityContainerPrincipal, setOpacityContainerPrincipal] = React.useState(1);
  const [snackErroOverlayVisible, setSnackErroOverlayVisible] = React.useState(false);
  const [mensagemErroOverlay, setMensagemErroOverlay] = React.useState('');
  
  const [adicionarDisponibilidadeShowDropDownDiaSemana, setAdicionarDisponibilidadeShowDropDownDiaSemana] = React.useState(false);

  const [adicionarDisponibilidadeDiaSemana, setAdicionarDisponibilidadeDiaSemana] = React.useState('');
  const [adicionarDisponibilidadeInicio, setAdicionarDisponibilidadeInicio] = React.useState('');
  const [adicionarDisponibilidadeSaida, setAdicionarDisponibilidadeSaida] = React.useState('');

  const toggleOverlayDisponibilidadeVisibility = () => {
    if (overlayAdicionarVisibility) {
      setOverlayAdicionarVisibility(false)
      setOpacityContainerPrincipal(1)
      setAdicionarDisponibilidadeDiaSemana('')
      setAdicionarDisponibilidadeInicio('')
      setAdicionarDisponibilidadeSaida('')
    } else {
      setOverlayAdicionarVisibility(true)
      setOpacityContainerPrincipal(0.2)
    }
  };

  const DiaSemanaList = [
    { label: 'Domingo', value: '1' },
    { label: 'Segunda-feira', value: '2' },
    { label: 'Terça-feira', value: '3' },
    { label: 'Quarta-feira', value: '4' },
    { label: 'Quinta-feira', value: '5' },
    { label: 'Sexta-feira', value: '6' },
    { label: 'Sábado', value: '7' },
  ];

  const API = axios.create({
    baseURL: ConfigFile.API_SERVER_URL,
  });

  const salvarHorario = async () => {

    if(adicionarDisponibilidadeDiaSemana == '' || adicionarDisponibilidadeInicio == '' || adicionarDisponibilidadeSaida == '') {
      setMensagemErroOverlay('Prencha todos os campos')
      setSnackErroOverlayVisible(true)      
    }

    else if(adicionarDisponibilidadeInicio.length != 5
            || parseInt(adicionarDisponibilidadeInicio.substr(0, 2)) > 24
            || parseInt(adicionarDisponibilidadeInicio.substr(3, 2)) > 59
            || (parseInt(adicionarDisponibilidadeInicio.substr(0, 2)) == 24 && parseInt(adicionarDisponibilidadeInicio.substr(3, 2)) != 0)
      ) {
      setMensagemErroOverlay('Horário início inválido')
      setSnackErroOverlayVisible(true)      
    }
    else if(adicionarDisponibilidadeSaida.length != 5
      || parseInt(adicionarDisponibilidadeSaida.substr(0, 2)) > 24
      || parseInt(adicionarDisponibilidadeSaida.substr(3, 2)) > 59
      || (parseInt(adicionarDisponibilidadeSaida.substr(0, 2)) == 24 && parseInt(adicionarDisponibilidadeSaida.substr(3, 2)) != 0)
      ) {
      setMensagemErroOverlay('Horário saída inválido')
      setSnackErroOverlayVisible(true)      
      }
      else {
        var disponibilidade = {
          diaSemana: adicionarDisponibilidadeDiaSemana,
          horaInicio: adicionarDisponibilidadeInicio,
          horaFim: adicionarDisponibilidadeSaida
        };
  
        try {
          const { id, token } = JSON.parse(await userLib.getUserAuthData())
          const resp = await API.post('/instrutor/adicionarDisponibilidade/' + id, 
            disponibilidade,
            {
              headers: 
              {
                Authorization: 'Bearer ' + token,
              }
            }
          )

          if(resp.status == 200)
          {  
            setSnackMensagem('Horário adicionado!')
            setSnackMensagemVisible(true)
            setCount(count+1)
            toggleOverlayDisponibilidadeVisibility()
          }
      
        } catch (error) {
          console.log('Algo saiu errado')
          setMensagemErroOverlay(error.response.data.error)
          setSnackMensagemVisible(true)
        }  
      }    
  }

  const removerHorario = async (idDisponibilidade: string) => {
    console.log(idDisponibilidade)
    try {
      const { token } = JSON.parse(await userLib.getUserAuthData())
      const resp = await API.delete('/instrutor/removerDisponibilidade/' + idDisponibilidade, 
        {
          headers: 
          {
            Authorization: 'Bearer ' + token,
          }
        }
      )

      if(resp.status == 200)
      {  
        setSnackMensagem('Horário removido!')
        setSnackMensagemVisible(true)
        setCount(count+1)
      }
  
    } catch (error) {
      setSnackMensagem('Erro ao remover horário')
      setSnackMensagemVisible(true)
    }  
  }

  const getInstrutor = async () => {

    try {

      const { id, token } = JSON.parse(await userLib.getUserAuthData())
      const resp = await API.get('/instrutor/' + id, 
      {
        headers: 
        {
          Authorization: 'Bearer ' + token,
        }
      })

      if(resp.status == 200)
      {
        console.log('Conseguiu carregar instrutor')
        return  resp.data.instrutor.instrutorDisponibilidade
      }
    } catch (error) {
      console.log('Não conseguiu carregar instrutor')
      console.log(error.response.data.error)
      setSnackMensagem(error.response.data.error)
      setSnackMensagemVisible(true)
    } 
  }

  navigation.addListener('focus', () => {
    setCount(count+1)
  })

  React.useEffect(() => {
    getInstrutor().then(
      (arrayDisponibilidades) => {
        setDisponibilidadesDomingo(arrayDisponibilidades.filter(x => x.diaSemana == "1"))
        setDisponibilidadesSegunda(arrayDisponibilidades.filter(x => x.diaSemana == "2"))
        setDisponibilidadesTerca(arrayDisponibilidades.filter(x => x.diaSemana == "3"))
        setDisponibilidadesQuarta(arrayDisponibilidades.filter(x => x.diaSemana == "4"))
        setDisponibilidadesQuinta(arrayDisponibilidades.filter(x => x.diaSemana == "5"))
        setDisponibilidadesSexta(arrayDisponibilidades.filter(x => x.diaSemana == "6"))
        setDisponibilidadesSabado(arrayDisponibilidades.filter(x => x.diaSemana == "7"))
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
        <Appbar.Content title="Disponibilidades" />
      </Appbar.Header>

      <View style={{opacity: opacityContainerPrincipal}}>

        <View style={styles.view_infos}>
          <View style={styles.item_icon}>
            <Icon name='clipboard' size={30} color='white'/>
          </View>
          <View style={styles.item_detalhes}>
            <Text style={styles.item_text_line}>
              <Text style={styles.item_text_disclaimer}>Cadastre abaixo os horários que você pretende receber aulas</Text>
            </Text>                  
          </View>
        </View>
        
        <View style={styles.view_adicionar} onTouchEnd={()=> {toggleOverlayDisponibilidadeVisibility()}}>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 3}}>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 24}} >Adicionar horário</Text>
          </View>        
        </View>

        <View style={styles.view_disponibilidades}>
          <ScrollView>
            
            <Text style={styles.item_text_bold} >Domingo</Text>
            
            {
              disponibilidadesDomingo.map((item: IDisponibilidade, id: number) => ( 

                <View key={item._id} style={styles.item} >
                  <View style={styles.item_status}>
                    <Icon name='circle' size={20} color='blue'/>
                  </View>
                  <View style={styles.item_detalhes}>
                    <Text style={styles.item_text_line}>
                      <Text style={styles.item_text_title}>Horário início: </Text>
                        <Text>{item.horaInicio}</Text>
                    </Text>
                    <Text style={styles.item_text_line}>
                      <Text style={styles.item_text_title}>Horário saída: </Text>
                        <Text>{item.horaFim}</Text>
                    </Text>
                  </View>
                  <View style={styles.item_action}>
                    <RectButton style={styles.button} onPress={() => {item._id ? removerHorario(item._id.toString()) : ''}}>
                      <Text style={styles.buttonText}>Remover</Text>
                    </RectButton>
                  </View >              
                </View>
              ))
            }

            <Text style={styles.item_text_bold} >Segunda-feira</Text>
            
            {
              disponibilidadesSegunda.map((item: IDisponibilidade, id: number) => ( 

                <View key={item._id} style={styles.item} >
                  <View style={styles.item_status}>
                    <Icon name='circle' size={20} color='blue'/>
                  </View>
                  <View style={styles.item_detalhes}>
                    <Text style={styles.item_text_line}>
                      <Text style={styles.item_text_title}>Horário início: </Text>
                        <Text>{item.horaInicio}</Text>
                    </Text>
                    <Text style={styles.item_text_line}>
                      <Text style={styles.item_text_title}>Horário saída: </Text>
                        <Text>{item.horaFim}</Text>
                    </Text>
                  </View>
                  <View style={styles.item_action}>
                    <RectButton style={styles.button} onPress={() => {item._id ? removerHorario(item._id.toString()) : ''}}>
                      <Text style={styles.buttonText}>Remover</Text>
                    </RectButton>
                  </View >              
                </View>
              ))
            }

            <Text style={styles.item_text_bold} >Terça-feira</Text>
            
            {
              disponibilidadesTerca.map((item: IDisponibilidade, id: number) => ( 

                <View key={item._id} style={styles.item} >
                  <View style={styles.item_status}>
                    <Icon name='circle' size={20} color='blue'/>
                  </View>
                  <View style={styles.item_detalhes}>
                    <Text style={styles.item_text_line}>
                      <Text style={styles.item_text_title}>Horário início: </Text>
                        <Text>{item.horaInicio}</Text>
                    </Text>
                    <Text style={styles.item_text_line}>
                      <Text style={styles.item_text_title}>Horário saída: </Text>
                        <Text>{item.horaFim}</Text>
                    </Text>
                  </View>
                  <View style={styles.item_action}>
                    <RectButton style={styles.button} onPress={() => {item._id ? removerHorario(item._id.toString()) : ''}}>
                      <Text style={styles.buttonText}>Remover</Text>
                    </RectButton>
                  </View >              
                </View>
              ))
            }

            <Text style={styles.item_text_bold} >Quarta-feira</Text>
            
            {
              disponibilidadesQuarta.map((item: IDisponibilidade, id: number) => ( 

                <View key={item._id} style={styles.item} >
                  <View style={styles.item_status}>
                    <Icon name='circle' size={20} color='blue'/>
                  </View>
                  <View style={styles.item_detalhes}>
                    <Text style={styles.item_text_line}>
                      <Text style={styles.item_text_title}>Horário início: </Text>
                        <Text>{item.horaInicio}</Text>
                    </Text>
                    <Text style={styles.item_text_line}>
                      <Text style={styles.item_text_title}>Horário saída: </Text>
                        <Text>{item.horaFim}</Text>
                    </Text>
                  </View>
                  <View style={styles.item_action}>
                    <RectButton style={styles.button} onPress={() => {item._id ? removerHorario(item._id.toString()) : ''}}>
                      <Text style={styles.buttonText}>Remover</Text>
                    </RectButton>
                  </View >              
                </View>
              ))
            }

            <Text style={styles.item_text_bold} >Quinta-feira</Text>
            
            {
              disponibilidadesQuinta.map((item: IDisponibilidade, id: number) => ( 

                <View key={item._id} style={styles.item} >
                  <View style={styles.item_status}>
                    <Icon name='circle' size={20} color='blue'/>
                  </View>
                  <View style={styles.item_detalhes}>
                    <Text style={styles.item_text_line}>
                      <Text style={styles.item_text_title}>Horário início: </Text>
                        <Text>{item.horaInicio}</Text>
                    </Text>
                    <Text style={styles.item_text_line}>
                      <Text style={styles.item_text_title}>Horário saída: </Text>
                        <Text>{item.horaFim}</Text>
                    </Text>
                  </View>
                  <View style={styles.item_action}>
                    <RectButton style={styles.button} onPress={() => {item._id ? removerHorario(item._id.toString()) : ''}}>
                      <Text style={styles.buttonText}>Remover</Text>
                    </RectButton>
                  </View >              
                </View>
              ))
            }

            <Text style={styles.item_text_bold} >Sexta-feira</Text>
            
            {
              disponibilidadesSexta.map((item: IDisponibilidade, id: number) => ( 

                <View key={item._id} style={styles.item} >
                  <View style={styles.item_status}>
                    <Icon name='circle' size={20} color='blue'/>
                  </View>
                  <View style={styles.item_detalhes}>
                    <Text style={styles.item_text_line}>
                      <Text style={styles.item_text_title}>Horário início: </Text>
                        <Text>{item.horaInicio}</Text>
                    </Text>
                    <Text style={styles.item_text_line}>
                      <Text style={styles.item_text_title}>Horário saída: </Text>
                        <Text>{item.horaFim}</Text>
                    </Text>
                  </View>
                  <View style={styles.item_action}>
                    <RectButton style={styles.button} onPress={() => {item._id ? removerHorario(item._id.toString()) : ''}}>
                      <Text style={styles.buttonText}>Remover</Text>
                    </RectButton>
                  </View >              
                </View>
              ))
            }

            <Text style={styles.item_text_bold} >Sábado</Text>
            
            {
              disponibilidadesSabado.map((item: IDisponibilidade, id: number) => ( 

                <View key={item._id} style={styles.item} >
                  <View style={styles.item_status}>
                    <Icon name='circle' size={20} color='blue'/>
                  </View>
                  <View style={styles.item_detalhes}>
                    <Text style={styles.item_text_line}>
                      <Text style={styles.item_text_title}>Horário início: </Text>
                        <Text>{item.horaInicio}</Text>
                    </Text>
                    <Text style={styles.item_text_line}>
                      <Text style={styles.item_text_title}>Horário saída: </Text>
                        <Text>{item.horaFim}</Text>
                    </Text>
                  </View>
                  <View style={styles.item_action}>
                    <RectButton style={styles.button} onPress={() => {item._id ? removerHorario(item._id.toString()) : ''}}>
                      <Text style={styles.buttonText}>Remover</Text>
                    </RectButton>
                  </View >              
                </View>
              ))
            }

          </ScrollView>
        </View>

        <Overlay isVisible={overlayAdicionarVisibility} overlayStyle={styles.overlay_criar_conta}>
          <Provider>
            <View style={styles.overlay_disponibilidade_view_titulo}>
              <View style={{flex: 1}}>
                <MaterialIcon name='arrow-back' size={35} onPress={toggleOverlayDisponibilidadeVisibility}/>
              </View>
            </View>
            
            <View style={styles.overlay_disponibilidade_view_dados}>
              <DropDown
                theme={theme}
                label={'Dia da semana'}
                mode={'flat'}
                value={adicionarDisponibilidadeDiaSemana}
                setValue={setAdicionarDisponibilidadeDiaSemana}
                list={DiaSemanaList}
                visible={adicionarDisponibilidadeShowDropDownDiaSemana}
                showDropDown={() => setAdicionarDisponibilidadeShowDropDownDiaSemana(true)}
                onDismiss={() => setAdicionarDisponibilidadeShowDropDownDiaSemana(false)}
                inputProps={{
                  right: <TextInputNativePaper.Icon name={'menu-down'} />,
                }}
              />
              <TextInputNativePaper theme={theme} label="Horário Início" value={adicionarDisponibilidadeInicio} returnKeyType={ 'done' }
                render={props =><TextInputMask
                  {...props}
                  type={'datetime'}
                  options={{
                    format: 'HH:mm'
                  }}
                  value={adicionarDisponibilidadeInicio}
                  onChangeText={text => setAdicionarDisponibilidadeInicio(text)}
                />}
              />
              <TextInputNativePaper theme={theme} label="Horário saída" value={adicionarDisponibilidadeSaida} returnKeyType={ 'done' }
                render={props =><TextInputMask
                  {...props}
                  type={'datetime'}
                  options={{
                    format: 'HH:mm'
                  }}
                  value={adicionarDisponibilidadeSaida}
                  onChangeText={text => setAdicionarDisponibilidadeSaida(text)}
                />}
              />
            </View>
                                
            <View style={styles.overlay_disponibilidade_view_button} onTouchEnd={salvarHorario}>
              <Text style={{textAlign: 'center', fontSize: 25, fontWeight: 'bold'}}>Salvar horário</Text>
            </View>

            <View >
              <Snackbar
                  visible={snackErroOverlayVisible}
                  onDismiss={() => setSnackErroOverlayVisible(false)}
                  action={{
                    label: 'Ok',
                    onPress: () => {},
                  }}>
                  {mensagemErroOverlay}
                </Snackbar>
            </View>

          </Provider>
        </Overlay>
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

export default disponibilidadesInstrutor;

const styles = StyleSheet.create({
  container_principal: {
    flex: 1,
    backgroundColor: 'black',
    alignContent: 'center',
    paddingTop: 40,
  },

  buttonView: {
    margin: 15,
    alignItems: 'center'
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
    marginTop: 3,
  },

  item_text_suave:{
    flex: 1,
  },

  item_text_disclaimer:{
    flex: 1,
    color: 'white'
  },

  item_text_bold:{
    fontWeight: 'bold',
    color: 'white',
    fontSize: 20,
    marginTop: 10,
  },

  view_items: {
    flex: 5,
    alignItems: 'center',
    width: '100%',
  },

  divider: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: 0.5,
    backgroundColor: 'white'
  },

  item: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#BBBBBB',
    marginTop: 15,
  },

  item_interno: {
    flex: 1,
    flexDirection: 'row',
   /*  backgroundColor: '#F1F1F1', */
    height: '90%',
  },

  item_status: {
    flex: 1,
    alignItems: 'center',
  },

  item_text_status_preenchimento: {
    flex: 1,
    color: 'white'
  },

  item_text_superior: {
    flex: 1,
    paddingTop: 10,
  },

  item_text_value: {
    flex: 1,
    fontSize: 20,
    color: 'white',
  },
  
  item_seta: {
    flex: 1,
    paddingTop: 8,
    alignItems: 'center',
  },
  
  view_adicionar: {
    flex: 3,
    backgroundColor: '#34CB79',
    height: 50
  },

    view_disponibilidades: {
    flex: 18,
    marginHorizontal: 10,
    marginBottom: 10,
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

  overlay_disponibilidade_view_titulo:{
    flex: 1,
    flexDirection: 'row',
  },

  overlay_criar_conta: {
    height: 350,
    width: 300,
    borderRadius: 8,
    backgroundColor: '#212F3C',
    marginBottom: 70
  },

  overlay_disponibilidade_view_dados:{
    flex: 8,
  },

  overlay_disponibilidade_view_button:{
    flex: 1.5,
    backgroundColor: 'red',
    margin: -10,
    borderBottomStartRadius: 8,
    borderBottomEndRadius: 8,
    justifyContent: 'center',  
  },

});
