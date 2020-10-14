import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ImageBackground } from 'react-native';
import { Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { 
  DefaultTheme,
  Provider,
  Snackbar,
  TextInput as TextInputNativePaper, 
} from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown'
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_900Black_Italic } from '@expo-google-fonts/roboto';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-community/async-storage';
import ConfigFile from "../../config.json"
import * as userLib from '../../lib/user.ts'
import axios from "axios";

const  Login = () => {

  const navigation = useNavigation();

  function handleNavigateToAlunoDashboard() {
    navigation.navigate('AlunoDashboard');
  }

  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_900Black_Italic
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackErroVisible, setSnackErroVisible] = React.useState(false);
  const [mensagemErro, setMensagemErro] = React.useState('');

  const [opacityContainerPrincipal, setOpacityContainerPrincipal] = useState(1);

  const [overlayCriaContaVisibility, setOverlayCriaContaVisibility] = useState(false);
  const [criarContaShowDropDownPapel, setCriarContaShowDropDownPapel] = useState(false);
  const [criarContaPapel, setCriarContaPapel] = useState('aluno');
  const [criarContaNome, setCriarContaNome] = React.useState('');
  const [criarContaEmail, setCriarContaEmail] = React.useState('');
  const [criarContaSenha, setCriarContaSenha] = React.useState('');
  const [criarContaRepetirSenha, setCriarContaRepetirSenha] = React.useState('');

  const [overlayEsqueciSenhaVisibility, setOverlayEsqueciSenhaVisibility] = useState(false);
  const [esqueciSenhaEmail, setEsqueciSenhaEmail] = React.useState('');

  const papelList = [
    { label: 'Aluno', value: 'aluno' },
    { label: 'Instrutor', value: 'instrutor' },
  ];

  const toggleOverlayCriarContaVisibility = () => {
    if (overlayCriaContaVisibility) {
      setOverlayCriaContaVisibility(false)
      setOpacityContainerPrincipal(1)
      setCriarContaNome('')
      setCriarContaEmail('')
      setCriarContaSenha('')
      setCriarContaRepetirSenha('')
    } else {
      setOverlayCriaContaVisibility(true)
      setOpacityContainerPrincipal(0.2)
    }
  };

  const toggleOverlayEsqueciSenhaVisibility = () => {
    if (overlayEsqueciSenhaVisibility) {
      setOverlayEsqueciSenhaVisibility(false)
      setOpacityContainerPrincipal(1)
    } else {
      setOverlayEsqueciSenhaVisibility(true)
      setOpacityContainerPrincipal(0.2)
    }
  };

  const API = axios.create({
    baseURL: ConfigFile.API_SERVER_URL,
  });

  const Entrar = async () => {

    /* var userData = {
      email, 
      senha: password 
    }; */

    var userData = {
      email: 'pedro.dog@hotmail.com', 
      senha: 'abc' 
    };
    
    try {
      const resp = await API.post('/auth/autenticar', userData)
      if(resp.status == 200)
      {
        console.log('Achou o usuário')

        const UserAuthData = {
          tipoUsuario: resp.data.tipoUsuario,
          id: resp.data.usuario._id,
          nome: resp.data.usuario.nome,
          sobrenome: resp.data.usuario.sobrenome,
          datahoraLogin: Date.now().toString(),
          token: resp.data.token
        }
        console.log(UserAuthData)

        userLib.storeUserAuthData(JSON.stringify(UserAuthData))

        if(UserAuthData.tipoUsuario == 'aluno'){
          handleNavigateToAlunoDashboard()
        }
      }

    } catch (error) {
      console.log('Deu Errado')
      setMensagemErro(error.response.data.error)
      setSnackErroVisible(true)
    }
    /* 
    LIDANDO COM O OBJETO "error" 
    error.response.data = Object {"error": "Usuário não encontrado",} 
    error.response = vem o objeto completo do erro
    error.message = Request failed with status code 400

    LIDANDO COM O OBJETVO "resp" quando a solicitação deu erro
    resp.status = 200
    resp.data = objeto devolvido pelo backend como resposta
    */   
  }

  const CriarConta = async () => {

    if(criarContaPapel != 'aluno' && criarContaPapel != 'instrutor') {
      setMensagemErro('Escolha o Tipo de Conta')
      setSnackErroVisible(true)
    }

    else if(criarContaNome == '' || criarContaEmail == '' || criarContaSenha == '' || criarContaRepetirSenha == '') {
      setMensagemErro('Prencha todos os campos')
      setSnackErroVisible(true)
    }

    else if(criarContaSenha.length < 6 || criarContaSenha.length > 12) {
      setMensagemErro('Senha deve ter entre 6 e 12 caracteres')
      setSnackErroVisible(true)
    }

    else if(criarContaSenha != criarContaRepetirSenha) {
      setMensagemErro('Confirmação da senha não confere')
      setSnackErroVisible(true)
    }
    else {
      var userData = {
        nome: criarContaNome,
        email: criarContaEmail,
        senha: criarContaSenha
      };
      console.log(userData)

      if(criarContaPapel == 'aluno') {
        try {
          const resp = await API.post('/auth/registrarAluno', userData)
          if(resp.status == 200)
          {
            console.log('Cadastrou o usuario tipo aluno')
    
            const UserAuthData = {
              tipoUsuario: resp.data.tipoUsuario,
              id: resp.data.aluno._id,
              nome: resp.data.aluno.nome,
              sobrenome: '',
              datahoraLogin: Date.now().toString(),
              token: resp.data.token
            }
            console.log(UserAuthData)
    
            userLib.storeUserAuthData(JSON.stringify(UserAuthData))

            setMensagemErro('Conta criada com sucesso!')
            setSnackErroVisible(true)
            
            setTimeout(() => {
              toggleOverlayCriarContaVisibility()              
              handleNavigateToAlunoDashboard()       
            }, 2000);                 
          }
    
        } catch (error) {
          console.log('Deu Errado')
          setMensagemErro(error.response.data.error)
          setSnackErroVisible(true)
        }
      }

    }
  }

  const EsqueciSenha = () => {
    console.log(esqueciSenhaEmail)
    setOverlayEsqueciSenhaVisibility(false)
  }

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

  while (!fontsLoaded) {
    return <View />;
  }

  return (
    <KeyboardAwareScrollView style={{flex: 1, backgroundColor: 'black', alignContent: 'center', paddingTop: 40, }} >
      <View style={{opacity: opacityContainerPrincipal}}>
        <ImageBackground
          style={{}}
          source={require('../../assets/bbb.jpg')}
          imageStyle={{ width: '100%', height: '100%' }}
        >
          <Text style={styles.Titulo}>SPEED DRIVE</Text>
          <Text style={styles.DescricaoMaior}>Treinamento para habilitados</Text>
          <Text style={styles.DescricaoMenor}>Sua liberdade</Text>
          <Text style={styles.DescricaoMenor}>perto de virar realidade.</Text>

          <View style={{paddingTop: 130, marginBottom: 20}}>
            <View style={styles.TextInput_Container}>
              <Icon name="user" size={25} color="white" style={{marginRight:10, width: '7%'}} />
              <TextInput style={{color: 'white', fontSize: 19, width: '93%'}}
              placeholder="e-mail"
              placeholderTextColor = "#797D7F"
              textContentType = "username"
              selectionColor = "red"
              autoCompleteType = "email"
              onChangeText = {email => setEmail(email)}
              value = {email}
              />            
            </View>
            <View style={styles.TextInput_Container}>
              <Icon name="key" size={25} color="white" style={{marginRight:10, width: '7%'}} />
              <TextInput style={{color: 'white', fontSize: 19, width: '93%'}}
              placeholder="senha"
              placeholderTextColor = "#797D7F"
              textContentType="password"
              secureTextEntry={true}
              selectionColor= "red"
              autoCompleteType = "password"
              onChangeText={password => setPassword(password)}
              value = {password}
              />
            </View>       
          </View>
          <View >
            <RectButton style={styles.button} onPress={Entrar}>
                <View style={styles.buttonIcon}>
                  <Feather name="play" color="#fff" size={24} />
                </View>
                <Text style={styles.buttonText}>Entrar</Text>
            </RectButton>
            <RectButton style={styles.button} onPress={toggleOverlayCriarContaVisibility}>
                <View style={styles.buttonIcon}>
                  <Feather name="plus" color="#fff" size={24} />
                </View>
                <Text style={styles.buttonText}>Criar conta</Text>
            </RectButton>
            <RectButton style={styles.buttonSemFundo} onPress={toggleOverlayEsqueciSenhaVisibility}>
                <View style={styles.buttonIcon}>
                  <Feather name="slack" color="#fff" size={24} />
                </View>
                <Text style={styles.buttonText}>Esqueci minha senha</Text>
            </RectButton>
          </View>
        </ImageBackground>
      </View>
      
      <Overlay isVisible={overlayCriaContaVisibility} overlayStyle={styles.overlay_criar_conta}>
        <Provider>
          <View style={styles.overlay_criar_conta_view_titulo}>
            <View style={{flex: 1}}>
              <MaterialIcon name='arrow-back' size={35} onPress={toggleOverlayCriarContaVisibility}/>
            </View>
          </View>
          
          <View style={styles.overlay_criar_conta_view_dados}>
            <DropDown
              theme={theme}
              label={'Tipo da Conta'}
              mode={'flat'}
              value={criarContaPapel}
              setValue={setCriarContaPapel}
              list={papelList}
              visible={criarContaShowDropDownPapel}
              showDropDown={() => setCriarContaShowDropDownPapel(true)}
              onDismiss={() => setCriarContaShowDropDownPapel(false)}
              inputProps={{
                right: <TextInputNativePaper.Icon name={'menu-down'} />,
              }}
            />
            <TextInputNativePaper theme={theme} label="Primeiro Nome" value={criarContaNome} onChangeText={text => setCriarContaNome(text)}/>
            <TextInputNativePaper theme={theme} label="E-mail" value={criarContaEmail} onChangeText={text => setCriarContaEmail(text)}/>
            <TextInputNativePaper secureTextEntry={true} theme={theme} label="Senha" value={criarContaSenha} onChangeText={text => setCriarContaSenha(text)}/>
            <TextInputNativePaper secureTextEntry={true} theme={theme} label="Repetir Senha" value={criarContaRepetirSenha} onChangeText={text => setCriarContaRepetirSenha(text)}/>
          </View>
                              
          <View style={styles.overlay_criar_conta_view_button} onTouchEnd={CriarConta}>
            <Text style={{textAlign: 'center', fontSize: 25, fontWeight: 'bold'}}>Criar conta</Text>
          </View>
        </Provider>
      </Overlay>

      <Overlay isVisible={overlayEsqueciSenhaVisibility} overlayStyle={styles.overlay_esqueci_senha}>
        <Provider>
          <View style={styles.overlay_esqueci_senha_view_titulo}>
            <View style={{flex: 1}}>
              <MaterialIcon name='arrow-back' size={35} onPress={toggleOverlayEsqueciSenhaVisibility}/>
            </View>
          </View>
          <View style={styles.overlay_esqueci_senha_view_dados}>          
            <Text style={{fontSize: 16, marginBottom: 15}} >Enviaremos instruções para que você possa recuperar sua conta</Text>
            <TextInputNativePaper theme={theme} label="E-mail" value={esqueciSenhaEmail} onChangeText={text => setEsqueciSenhaEmail(text)}/>
          </View>
                              
          <View style={styles.overlay_esqueci_senha_view_button} onTouchEnd={EsqueciSenha}>
            <Text style={{textAlign: 'center', fontSize: 25, fontWeight: 'bold'}}>Recuperar conta</Text>
          </View>
        </Provider>
      </Overlay>

      <View style={{marginTop: 50}} >
        <Snackbar
            visible={snackErroVisible}
            onDismiss={() => setSnackErroVisible(false)}
            action={{
              label: 'Ok',
              onPress: () => {},
            }}>
            {mensagemErro}
          </Snackbar>
      </View>

    </KeyboardAwareScrollView>
  );
}

export default Login;

const styles = StyleSheet.create({
  container_principal: {
    flex: 1,
    backgroundColor: 'black',
    alignContent: 'center',
    paddingTop: 40,
  },
  TextInput_Container: {
    flexDirection: 'row', 
    borderBottomColor: '#797D7F', 
    borderWidth: 1.5, 
    marginLeft: 10, 
    marginRight: 10,
    marginTop: 20,
    paddingBottom: 5
  },
  Titulo: {
    fontSize: 35,
    fontWeight: '800',
    /* fontFamily: 'Verdana', */
    fontFamily: 'Roboto_500Medium',
    color: "#C80000",
    textAlign: 'right',
    marginRight: 20,
    marginBottom: 7,
  },
  DescricaoMaior: {
    fontSize: 17,
    fontWeight: '400',
    /* fontFamily: 'Verdana', */
    fontFamily: 'Roboto_500Medium',
    /* color: "#C80000", */
    color: '#F7C700',
    textAlign: 'right',
    marginRight: 20,
    marginBottom: 30
  },  
  DescricaoMenor: {
    fontSize: 15,
    fontWeight: '200',
    /* fontFamily: 'Verdana', */
    fontFamily: 'Roboto_500Medium',
    color: '#797D7F',
    textAlign: 'right',
    marginRight: 20
  },
  button: {
    backgroundColor: '#34CB79',
    height: 40,
    width: '70%',
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 15,
    marginStart: '15%'
  },
  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    flex: 1,
    justifyContent: 'center',
    paddingStart: 20,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium'
  },
  buttonSemFundo: {
    height: 40,
    width: '70%',
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 15,
    marginStart: '15%',
    backgroundColor: '#212F3C',
    borderColor: '#34CB79',
    borderWidth: 2
  },

  overlay_criar_conta: {
    height: 450,
    width: 300,
    borderRadius: 8,
    backgroundColor: '#212F3C',
    marginBottom: 70
  },

  overlay_esqueci_senha: {
    height: 250,
    width: 300,
    borderRadius: 8,
    backgroundColor: '#212F3C',
    marginBottom: 70
  },

  overlay_criar_conta_view_titulo:{
    flex: 1,
    flexDirection: 'row',
  },

  overlay_esqueci_senha_view_titulo:{
    flex: 1,
    flexDirection: 'row',
  },

  overlay_criar_conta_view_dados:{
    flex: 8,
  },

  overlay_esqueci_senha_view_dados:{
    flex: 4,
  },

  overlay_criar_conta_view_button:{
    flex: 1.5,
    backgroundColor: 'red',
    margin: -10,
    borderBottomStartRadius: 8,
    borderBottomEndRadius: 8,
    justifyContent: 'center',  
  },

  overlay_esqueci_senha_view_button:{
    flex: 1.5,
    backgroundColor: 'red',
    margin: -10,
    borderBottomStartRadius: 8,
    borderBottomEndRadius: 8,
    justifyContent: 'center',  
  },

});
