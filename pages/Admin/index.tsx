import React, {useState, useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Appbar, Avatar, Snackbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MenuDrawer from 'react-native-side-drawer'
import SideMenuItem from '../../components/SideMenuItem';
import SideMenuItemSair from '../../components/SideMenuItemSair';
import ConfigFile from "../../config.json"
import * as userLib from '../../lib/user'
import axios from "axios";
import { TapGestureHandler } from 'react-native-gesture-handler'
import {
  TouchableNativeFeedback,
  TouchableHighlight,
  TouchableOpacity as TouchableOpacity2,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';

const AdminDashboard = (props: any) => {
  
  const navigation = useNavigation();
  
  const _handleSair = (origemMenuLateral: boolean) => {
    setMenuOpened(false)    
    if (origemMenuLateral || !menuOpened) {
      userLib.removeUserAuthData();
      navigation.navigate('Login');
    }      
  }
  const _handleInstrutorCadastro = (origemMenuLateral: boolean) => {
    setMenuOpened(false)
    if (origemMenuLateral || !menuOpened)     
      navigation.navigate('InstrutorCadastro');
  }
  const _handleNotificacoes = (origemMenuLateral: boolean) => {
    setMenuOpened(false)
    if (origemMenuLateral || !menuOpened)     
      navigation.navigate('Notificacoes');
  }
  const _handleConfiguracoes = (origemMenuLateral: boolean) => {
    setMenuOpened(false)
    if (origemMenuLateral || !menuOpened)     
      navigation.navigate('AdminConfiguracoes');
  }
  const _handleListaAlunos = (origemMenuLateral: boolean) => {
    setMenuOpened(false)
    if (origemMenuLateral || !menuOpened)     
      navigation.navigate('ListaAlunos');
  }
  const _handleListaInstrutores = (origemMenuLateral: boolean) => {
    setMenuOpened(false)
    if (origemMenuLateral || !menuOpened)     
      navigation.navigate('ListaInstrutores');
  }
  const _handleAgendamentos = (origemMenuLateral: boolean) => {
    setMenuOpened(false)
    if (origemMenuLateral || !menuOpened)     
      navigation.navigate('FiltrosAgendamentos');
  }
  const _handleTouchMenu = async () => {
    menuOpened ? setMenuOpened(false) : setMenuOpened(true)
  };

  const [menuOpened, setMenuOpened] = React.useState(false);
  const [snackMensagemVisible, setSnackMensagemVisible] = React.useState(false);
  const [snackMensagem, setSnackMensagem] = React.useState('');
  const [count, setCount] = React.useState(0)

  const [nomeCompleto, setNomeCompleto] = React.useState('Admin');
  const [urlFotoPerfil, setUrlFotoPerfil] = React.useState();
  const [qtdAlunosCadastrados, setQtdAlunosCadastrados] = useState(0)
  const [qtdInstrutoresCadastrados, setQtdInstrutoresCadastrados] = useState(0)
  const [qtdPendentesRoteamento, setQtdPendentesRoteamento] = useState(0)
  const [temNotificacao, setTemNotificacao] = useState(false)

  const API = axios.create({
    baseURL: ConfigFile.API_SERVER_URL,
  });

  const PreencheInfosDashboard = async () => {
     try { 
      const { id, token } = JSON.parse(await userLib.getUserAuthData())

      const resp = await API.get('/empresa/infosDash/', {headers: {Authorization: 'Bearer ' + token}})

      if(resp.status == 200)
      {
        console.log('Conseguiu carregar infos dash admin')

        setQtdAlunosCadastrados(resp.data.response.qtdAlunosCadastrados)
        setQtdInstrutoresCadastrados(resp.data.response.qtdInstrutoresCadastrados)
        setQtdPendentesRoteamento(resp.data.response.qtdPendentesRoteamento)
      }
    } catch (error) {
      console.log('Não conseguiu carregar infos dash admin')
      console.log(error.response.data.error)
      setSnackMensagem(error.response.data.error)
      setSnackMensagemVisible(true)
    } 
  }

  navigation.addListener('focus', () => {
    setCount(count+1)
  })

  useEffect(() => {
    PreencheInfosDashboard()  
   
  }, [count])

  const drawerContent = () => {
    return (    

      <TouchableOpacity style={styles.animatedMenuBox}>
        <TouchableOpacity2 onPress={() => setMenuOpened(false)}>
          <View style={{height: 100, flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.menu_text_voltar}>Fechar Menu</Text>
          </View>
        </TouchableOpacity2>

        <TouchableOpacity2 onPress={() => _handleConfiguracoes(true)}>
          <SideMenuItem icon='cog' text='Configurações'/>
        </TouchableOpacity2>
        <TouchableOpacity2 onPress={() => _handleListaAlunos(true)}>
          <SideMenuItem icon='user' text='Alunos'/>
        </TouchableOpacity2>
        <TouchableOpacity2 onPress={() => _handleListaInstrutores(true)}>
          <SideMenuItem icon='car' text='Instrutores'/>
        </TouchableOpacity2>
        <TouchableOpacity2 onPress={() => _handleAgendamentos(true)}>
          <SideMenuItem icon='calendar' text='Agendamentos'/>
        </TouchableOpacity2>
        <TouchableOpacity2 onPress={() => _handleSair(true)}>
          <SideMenuItemSair icon='arrow-circle-left' text='Sair da conta'/>
        </TouchableOpacity2>

      </TouchableOpacity>
      
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container_principal} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

      <MenuDrawer 
        open={menuOpened} 
        drawerContent={drawerContent()}
        drawerPercentage={65}
        animationTime={400}
        overlay={false}
        opacity={0.2}
      >

        <Appbar.Header statusBarHeight={45} style={{height: 60, backgroundColor: '#212F3C'}}>
          <TouchableOpacity2 onPress={() => _handleTouchMenu()}>
            <Appbar.Action icon="menu" color='white' size={30}/>
          </TouchableOpacity2>
          {/* ToDo: implementar comportamento de click para o texto do Content abaixo */}
          <Appbar.Content onTouchEnd={() => setMenuOpened(false)} title={nomeCompleto} style={{alignItems: 'center'}}/>
          <TouchableOpacity2 onPress={() => _handleNotificacoes(false)} >
            <Appbar.Action icon="bell" color='white' size={30} />
          </TouchableOpacity2>
        </Appbar.Header>


        <View style={{alignItems: 'center'}} onTouchEnd={() => setMenuOpened(false)}>
          <Avatar.Image 
            size={170}
            source={{ uri: urlFotoPerfil ? urlFotoPerfil : ConfigFile.URL_IMAGEM_NAO_ENCONTRADA}}
            style={{marginTop: 15, marginBottom: 15}}          
          />
        </View>
        
        <View style={styles.dash}>
          <View style={styles.dash_column}>

            <TapGestureHandler onHandlerStateChange={() => _handleListaAlunos(false)}>
              <View style={styles.item_dash_exterior}>
                <View style={styles.item_dash_interior_1}>
                  <View style={styles.item_dash_view_texto}>
                    <Text style={styles.item_dash_texto_1}>Alunos</Text>
                  </View>
                  <View style={styles.item_dash_view_texto}>
                    <Text style={styles.item_dash_texto_2}>Cadastrados</Text>
                  </View>
                  <View style={styles.item_dash_view_numero}>
                    <Text style={styles.item_dash_texto_3}>{qtdAlunosCadastrados}</Text>
                  </View>
                </View>
              </View>
            </TapGestureHandler>

            <TapGestureHandler onHandlerStateChange={() => _handleAgendamentos(false)}>
              <View style={styles.item_dash_exterior}>
                <View style={styles.item_dash_interior_2}>
                  <View style={styles.item_dash_view_texto}>
                    <Text style={styles.item_dash_texto_1}>Aulas Pendentes</Text>
                  </View>
                  <View style={styles.item_dash_view_texto}>
                    <Text style={styles.item_dash_texto_2}>Roteamento</Text>
                  </View>
                  <View style={styles.item_dash_view_numero}>
                    <Text style={styles.item_dash_texto_3}>{qtdPendentesRoteamento}</Text>
                  </View>
                </View>
              </View>
            </TapGestureHandler>

          </View>

          <View style={styles.dash_column}>            

            <TapGestureHandler onHandlerStateChange={() => _handleListaInstrutores(false)}>
              <View style={styles.item_dash_exterior}>
                <View style={styles.item_dash_interior_3} >
                  <View style={styles.item_dash_view_texto}>
                    <Text style={styles.item_dash_texto_1}>Instrutores</Text>
                  </View>
                  <View style={styles.item_dash_view_texto}>
                    <Text style={styles.item_dash_texto_2}>Cadastrados</Text>
                  </View>
                  <View style={styles.item_dash_view_numero}>
                    <Text style={styles.item_dash_texto_3}>{qtdInstrutoresCadastrados}</Text>
                  </View>
                </View>
              </View>
            </TapGestureHandler>

            <TapGestureHandler onHandlerStateChange={() => _handleConfiguracoes(false)}>
              <View style={styles.item_dash_exterior}>
                <View style={styles.item_dash_interior_4}>
                  <View style={styles.item_dash_view_agendar}>
                    <Text style={styles.item_dash_texto_agendar}>Configurações</Text>
                  </View>
                  <View style={styles.item_dash_view_numero}>
                    <Icon name= 'cog' color= 'purple' size={90} />
                  </View>
                </View>
              </View>
            </TapGestureHandler>
            
          </View>
        </View>

        <Snackbar
          visible={snackMensagemVisible}
          onDismiss={() => setSnackMensagemVisible(false)}
          action={{
            label: 'Ajustar',
            onPress: () => _handleInstrutorCadastro(false),
          }}>
          {snackMensagem}
        </Snackbar>

      </MenuDrawer>

    </KeyboardAvoidingView>

  );
}

export default AdminDashboard;

const styles = StyleSheet.create({
  container_principal: {
    flex: 1,
    backgroundColor: 'black',
    alignContent: 'center',
    paddingTop: 40,
  },

  dash:{
    flex: 1, 
    flexDirection: 'row'
  },

  dash_column:{
    flex: 1
  },

  item_dash_exterior: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },

  item_dash_interior_1: {
    width: '100%', 
    height: '100%', 
    backgroundColor: '#A3D6D4',
    paddingTop: 10,
    alignItems: 'center',
  },

  item_dash_interior_2: {
    width: '100%', 
    height: '100%', 
    backgroundColor: '#E2A9BE',
    paddingTop: 10,
    alignItems: 'center',
  },

  item_dash_interior_3: {
    width: '100%', 
    height: '100%', 
    backgroundColor: '#F1E9CB',
    paddingTop: 10,
    alignItems: 'center',
  },

  item_dash_interior_4: {
    width: '100%', 
    height: '100%', 
    backgroundColor: '#C2D5A7',
    paddingTop: 10,
    alignItems: 'center',
  },

  item_dash_view_texto:{
    flex: 1,
  },

  item_dash_view_agendar:{
    flex: 2,
  },

  item_dash_view_numero:{
    flex: 5, 
    justifyContent: 'center'
  },

  item_dash_texto_1:{
    fontWeight: 'bold',
    fontSize: 20
  },

  item_dash_texto_2:{
    fontSize: 25
  },

  item_dash_texto_3:{
    fontSize: 80,
    fontWeight: 'bold'
  },
  item_dash_texto_agendar:{
    fontSize: 25,
    fontWeight: 'bold'
  },

  animatedMenuBox: {
    flex: 1,
    backgroundColor: "#47476b",
    padding: 15
  },

  menu_text_voltar: {
    flex: 1,
    color: '#A79898',
    fontSize: 22,
    paddingTop: 20,
  },

});