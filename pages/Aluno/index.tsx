import React, {useState, useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Appbar, Avatar, Snackbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MenuDrawer from 'react-native-side-drawer'
import SideMenuItem from '../../components/SideMenuItem';
import SideMenuItemSair from '../../components/SideMenuItemSair';
import ConfigFile from "../../config.json"
import * as userLib from '../../lib/user.ts'
import axios from "axios";

const AlunoDashboard = (props: any) => {
  
  const navigation = useNavigation();
  
  const _handleSair = (origemMenuLateral: boolean) => {
    setMenuOpened(false)    
    if (origemMenuLateral || !menuOpened) {
      userLib.removeUserAuthData();
      navigation.navigate('Login');
    }      
  }
  const _handleAulasRealizadas = (origemMenuLateral: boolean) => {
    setMenuOpened(false)    
    if (origemMenuLateral || !menuOpened)     
      navigation.navigate('AlunoRealizadas');
  }
  const _handleProximasAulas = (origemMenuLateral: boolean) => {
    setMenuOpened(false)
    if (origemMenuLateral || !menuOpened)     
      navigation.navigate('AlunoProximas');
  }
  const _handleAgendar = (origemMenuLateral: boolean) => {
    setMenuOpened(false)
    if (origemMenuLateral || !menuOpened){
      if (statusCadastroOk)
        navigation.navigate('AlunoAgendar');
      else{
        setSnackMensagem('Cadastro Pendente!')
        setSnackMensagemVisible(true)
      }        
    }
  }
  const _handleAlunoCadastro = (origemMenuLateral: boolean) => {
    setMenuOpened(false)
    if (origemMenuLateral || !menuOpened)     
      navigation.navigate('AlunoCadastro');
  }
  const _handleNotificacoes = (origemMenuLateral: boolean) => {
    setMenuOpened(false)
    if (origemMenuLateral || !menuOpened)     
      navigation.navigate('Notificacoes');
  }
  const _handleTouchMenu = async () => {
    menuOpened ? setMenuOpened(false) : setMenuOpened(true)
  };

  const [menuOpened, setMenuOpened] = React.useState(false);
  const [snackMensagemVisible, setSnackMensagemVisible] = React.useState(false);
  const [snackMensagem, setSnackMensagem] = React.useState('');
  const [count, setCount] = React.useState(0)

  const [nomeCompleto, setNomeCompleto] = React.useState('');
  const [urlFotoPerfil, setUrlFotoPerfil] = React.useState();
  const [qtdAulasRealizadas, setQtdAulasRealizadas] = useState(0)
  const [qtdProximasAulas, setQtdProximasAulas] = useState(0)
  const [statusCadastroOk, setStatusCadastroOk] = useState(false)
  const [temNotificacao, setTemNotificacao] = useState(false)

  const API = axios.create({
    baseURL: ConfigFile.API_SERVER_URL,
  });

  const PreencheInfosDashboard = async () => {
     try { 
      const { id, token } = JSON.parse(await userLib.getUserAuthData())

      const resp = await API.get('/aluno/infosDash/' + id, {headers: {Authorization: 'Bearer ' + token}})

      if(resp.status == 200)
      {
        console.log('Conseguiu carregar infos dash')

        setNomeCompleto(resp.data.response.nome + ' ' + resp.data.response.sobrenome)
        setUrlFotoPerfil(resp.data.response.urlFotoPerfil)
        setStatusCadastroOk(resp.data.response.isCadastroCompleto)
        setTemNotificacao(resp.data.response.hasNotificacao)
        setQtdAulasRealizadas(resp.data.response.qtdAulasRealizadas)
        setQtdProximasAulas(resp.data.response.qtdProximasAulas)
      }
    } catch (error) {
      console.log('Não conseguiu carregar infos dash')
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
        <View onTouchEnd={() => setMenuOpened(false)} style={{height: 100, flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.menu_text_voltar}>Fechar Menu</Text>
        </View>

        <SideMenuItem icon='cogs' text='Cadastro' onAction={() => _handleAlunoCadastro(true)}/>
        <SideMenuItem icon='check-circle' text='Aulas Realizada' onAction={() => _handleAulasRealizadas(true)}/>
        <SideMenuItem icon='exclamation-circle' text='Próximas Aulas' onAction={() => _handleProximasAulas(true)}/>
        <SideMenuItem icon='car' text='Agendar Aulas' onAction={() => _handleAgendar(true)}/>
        <SideMenuItem icon='envelope' text='Notificações' onAction={() => _handleNotificacoes(true)}/>
        {/* <SideMenuItem icon='comments' text='Contato' onAction={() => {}}/> */}
        <SideMenuItemSair icon='arrow-circle-left' text='Sair da conta' onAction={() => _handleSair(true)}/>

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
          <Appbar.Action icon="menu" size={30} onPress={ _handleTouchMenu} />
          <Appbar.Content onTouchEnd={() => setMenuOpened(false)} title={nomeCompleto} />
          <Appbar.Action icon="bell" size={30} onPress={() => _handleNotificacoes(false)} />
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
            <View style={styles.item_dash_exterior}>
              <View style={styles.item_dash_interior_1} onTouchEnd={() => _handleAulasRealizadas(false)}>
                <View style={styles.item_dash_view_texto}>
                  <Text style={styles.item_dash_texto_1}>Aulas</Text>
                </View>
                <View style={styles.item_dash_view_texto}>
                  <Text style={styles.item_dash_texto_2}>Realizadas</Text>
                </View>
                <View style={styles.item_dash_view_numero}>
                  <Text style={styles.item_dash_texto_3}>{qtdAulasRealizadas}</Text>
                </View>
              </View>
            </View>
            <View style={styles.item_dash_exterior}>
              <View style={styles.item_dash_interior_2} onTouchEnd={() => _handleAlunoCadastro(false)}>
                <View style={styles.item_dash_view_texto}>
                  <Text style={styles.item_dash_texto_1}>Cadastro</Text>
                </View>
                <View style={styles.item_dash_view_texto}>
                  <Text style={styles.item_dash_texto_2}>{statusCadastroOk ? 'Ok' : 'Pendente'}</Text>
                </View>
                <View style={styles.item_dash_view_numero}>
                  {statusCadastroOk ? <Icon name= 'check-circle' color= 'green' size={90} /> : <Icon name= 'times-circle' color= 'red' size={90} />}
                </View>
              </View>
            </View>
          </View>
          <View style={styles.dash_column}>
            <View style={styles.item_dash_exterior}>
              <View style={styles.item_dash_interior_3} onTouchEnd={() => _handleProximasAulas(false)}>
                <View style={styles.item_dash_view_texto}>
                  <Text style={styles.item_dash_texto_1}>Próximas</Text>
                </View>
                <View style={styles.item_dash_view_texto}>
                  <Text style={styles.item_dash_texto_2}>Aulas</Text>
                </View>
                <View style={styles.item_dash_view_numero}>
                  <Text style={styles.item_dash_texto_3}>{qtdProximasAulas}</Text>
                </View>
              </View>
            </View>
            <View style={styles.item_dash_exterior}>
              <View style={styles.item_dash_interior_4} onTouchEnd={() => _handleAgendar(false)}>
                <View style={styles.item_dash_view_agendar}>
                  <Text style={styles.item_dash_texto_agendar}>Agendar</Text>
                </View>
                <View style={styles.item_dash_view_numero}>
                  <Icon name= 'plus' color= 'purple' size={90} />
                </View>
              </View>
            </View>
          </View>
        </View>

        <Snackbar
          visible={snackMensagemVisible}
          onDismiss={() => setSnackMensagemVisible(false)}
          action={{
            label: 'Ajustar',
            onPress: () => _handleAlunoCadastro(false),
          }}>
          {snackMensagem}
        </Snackbar>

      </MenuDrawer>

    </KeyboardAvoidingView>

  );
}

export default AlunoDashboard;

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
    fontSize: 35,
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