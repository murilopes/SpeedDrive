import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ImageBackground, ScrollView } from 'react-native';
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
  Switch 
} from 'react-native-paper';
import CheckBox from '../../components/Checkbox'
import DropDown from 'react-native-paper-dropdown'
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_900Black_Italic } from '@expo-google-fonts/roboto';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ConfigFile from "../../config.json"
import * as userLib from '../../lib/user.ts'
import axios from "axios";

const  Login = () => {

  const navigation = useNavigation();

  function handleNavigateToAlunoDashboard() {
    navigation.navigate('AlunoDashboard');
  }

  function handleNavigateToInstrutorDashboard() {
    navigation.navigate('InstrutorDashboard');
  }

  function handleNavigateToAdminDashboard() {
    navigation.navigate('AdminDashboard');
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
  const [snackErroOverlayVisible, setSnackErroOverlayVisible] = React.useState(false);
  const [mensagemErroOverlay, setMensagemErroOverlay] = React.useState('');

  const [opacityContainerPrincipal, setOpacityContainerPrincipal] = useState(1);

  const [overlayCriaContaVisibility, setOverlayCriaContaVisibility] = useState(false);
  const [criarContaShowDropDownPapel, setCriarContaShowDropDownPapel] = useState(false);
  const [criarContaPapel, setCriarContaPapel] = useState('aluno');
  const [criarContaWhatsapp, setCriarContaWhatsapp] = React.useState('');
  const [criarContaNome, setCriarContaNome] = React.useState('');
  const [criarContaEmail, setCriarContaEmail] = React.useState('');
  const [criarContaSenha, setCriarContaSenha] = React.useState('');
  const [criarContaRepetirSenha, setCriarContaRepetirSenha] = React.useState('');
  const [criarContaCheckTermosDeUso, setCriarContaCheckTermosDeUso] = React.useState(false);
  const [criarContaCheckTermoDadosPessoais, setCriarContaCheckTermoDadosPessoais] = React.useState(false);
  const [overlayTermosDeUsoAlunoVisibility, setOverlayTermosDeUsoAlunoVisibility] = useState(false);
  const [overlayTermosDeUsoInstrutorVisibility, setOverlayTermosDeUsoInstrutorVisibility] = useState(false);
  const [overlayTermoDadosPessoaisVisibility, setOverlayTermoDadosPessoaisVisibility] = useState(false);

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
      setCriarContaWhatsapp('')
      setCriarContaEmail('')
      setCriarContaSenha('')
      setCriarContaRepetirSenha('')
      setCriarContaCheckTermosDeUso(false)
      setCriarContaCheckTermoDadosPessoais(false)
    } else {
      setOverlayCriaContaVisibility(true)
      setOpacityContainerPrincipal(0.2)
    }
  };

  const criarContaAlteraDropDownTipoConta = (value: string) => {
    setCriarContaPapel(value)
    setCriarContaCheckTermosDeUso(false)
    setCriarContaCheckTermoDadosPessoais(false)
  }

  const toggleOverlayEsqueciSenhaVisibility = () => {
    if (overlayEsqueciSenhaVisibility) {
      setOverlayEsqueciSenhaVisibility(false)
      setOpacityContainerPrincipal(1)
      setEsqueciSenhaEmail('')
    } else {
      setOverlayEsqueciSenhaVisibility(true)
      setOpacityContainerPrincipal(0.2)
    }
  };

  const toggleOverlayTermosDeUsoVisibility = () => {
    if(criarContaPapel == 'aluno') {
      toggleOverlayTermosDeUsoAlunoVisibility()
    } else {
      toggleOverlayTermosDeUsoInstrutorVisibility()
    }
  }

  const toggleOverlayTermosDeUsoAlunoVisibility = () => {
    if (overlayCriaContaVisibility) {
      setOverlayCriaContaVisibility(false)
      setOverlayTermosDeUsoAlunoVisibility(true)
    } else {
      setOverlayCriaContaVisibility(true)
      setOverlayTermosDeUsoAlunoVisibility(false)
    }
  };

  const toggleOverlayTermosDeUsoInstrutorVisibility = () => {
    if (overlayCriaContaVisibility) {
      setOverlayCriaContaVisibility(false)
      setOverlayTermosDeUsoInstrutorVisibility(true)
    } else {
      setOverlayCriaContaVisibility(true)
      setOverlayTermosDeUsoInstrutorVisibility(false)
    }
  };

  const toggleOverlayTermoDadosPessoaisVisibility = () => {
    if (overlayCriaContaVisibility) {
      setOverlayCriaContaVisibility(false)
      setOverlayTermoDadosPessoaisVisibility(true)
    } else {
      setOverlayCriaContaVisibility(true)
      setOverlayTermoDadosPessoaisVisibility(false)
    }
  };

  const API = axios.create({
    baseURL: ConfigFile.API_SERVER_URL,
  });

  const Entrar = async () => {

    var userData = {
      email, 
      senha: password 
    }; 

   /*  var userData = {
      email: 'pedro.dog@hotmail.com', 
      senha: 'abc' 
    }; */
    
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

        setEmail('')
        setPassword('')

        if(UserAuthData.tipoUsuario == 'aluno'){
          handleNavigateToAlunoDashboard()
        }
        if(UserAuthData.tipoUsuario == 'instrutor'){
          handleNavigateToInstrutorDashboard()
        }
        if(UserAuthData.tipoUsuario == 'admin'){
          handleNavigateToAdminDashboard()
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
       setMensagemErroOverlay('Escolha o Tipo   de Conta')
       setSnackErroOverlayVisible(true)
      }
      
      else if(criarContaNome == '' || criarContaWhatsapp == '' || criarContaEmail == '' || criarContaSenha == '' || criarContaRepetirSenha == '') {
        setMensagemErroOverlay('Preencha todos os campos')
      setSnackErroOverlayVisible(true)
    }

    else if(criarContaSenha.length < 6 || criarContaSenha.length > 12) {
      setMensagemErroOverlay('Senha deve ter entre 6 e 12 caracteres')
      setSnackErroOverlayVisible(true)
    }

    else if(criarContaSenha != criarContaRepetirSenha) {
      setMensagemErroOverlay('Confirmação da senha não confere')
      setSnackErroOverlayVisible(true)
    }

    else if(criarContaCheckTermosDeUso == false || criarContaCheckTermoDadosPessoais == false) {
      setMensagemErroOverlay('É necessário aceitar os termos para prosseguir')
      setSnackErroOverlayVisible(true)
    }
    
    else {
      var userData = {
        nome: criarContaNome,
        whatsapp: criarContaWhatsapp,
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
          console.log('Algo saiu errado')
          setMensagemErro(error.response.data.error)
          setSnackErroVisible(true)
        }
      }

      if(criarContaPapel == 'instrutor') {
        
        try {
          const resp = await API.post('/auth/registrarInstrutor', userData)
          if(resp.status == 200)
          {
            console.log('Cadastrou o usuario tipo instrutor')
    
            const UserAuthData = {
              tipoUsuario: resp.data.tipoUsuario,
              id: resp.data.instrutor._id,
              nome: resp.data.instrutor.nome,
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
              handleNavigateToInstrutorDashboard()       
            }, 2000);                 
          }
    
        } catch (error) {
          console.log('Algo saiu errado')
          setMensagemErro(error.response.data.error)
          setSnackErroVisible(true)
        }
      }

    }
  }

  const EsqueciSenha = () => {
    console.log(esqueciSenhaEmail)
    toggleOverlayEsqueciSenhaVisibility() 
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
      <View style={{opacity: opacityContainerPrincipal, marginTop: 30}}>
        
          <Text style={styles.Titulo}>SPEED DRIVE</Text>
          <Text style={styles.DescricaoMaior}>Treinamento para habilitados</Text>
          <Text style={styles.DescricaoMenor}>Sua liberdade</Text>
          <Text style={styles.DescricaoMenor}>perto de virar realidade.</Text>
          <ImageBackground
            style={{}}
            source={require('../../assets/bbb.jpg')}
            imageStyle={{ width: '100%', height: '90%' }}
          >
          <View style={{paddingTop: 200, marginBottom: 30}}>
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
        <View>
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
              setValue={(_value) => criarContaAlteraDropDownTipoConta(_value.toString())}
              list={papelList}
              visible={criarContaShowDropDownPapel}
              showDropDown={() => setCriarContaShowDropDownPapel(true)}
              onDismiss={() => setCriarContaShowDropDownPapel(false)}
              inputProps={{
                right: <TextInputNativePaper.Icon name={'menu-down'} />,
              }}
            />
            <TextInputNativePaper theme={theme} label="Primeiro Nome" value={criarContaNome} onChangeText={text => setCriarContaNome(text)}/>
            <TextInputNativePaper theme={theme} label="WhatsApp" value={criarContaWhatsapp} onChangeText={text => setCriarContaWhatsapp(text)}/>
            <TextInputNativePaper theme={theme} label="E-mail" value={criarContaEmail} onChangeText={text => setCriarContaEmail(text)}/>
            <TextInputNativePaper secureTextEntry={true} theme={theme} label="Senha" value={criarContaSenha} onChangeText={text => setCriarContaSenha(text)}/>
            <TextInputNativePaper secureTextEntry={true} theme={theme} label="Repetir Senha" value={criarContaRepetirSenha} onChangeText={text => setCriarContaRepetirSenha(text)}/>
            <CheckBox 
                    selected={criarContaCheckTermosDeUso} 
                    onPressCheck={() => setCriarContaCheckTermosDeUso(!criarContaCheckTermosDeUso)}
                    onPressText={toggleOverlayTermosDeUsoVisibility}
                    text='Aceito os termos e condições de uso'
                    style={{marginTop: 10}}
                    textStyle={{fontSize: 15, color:'white', textDecorationLine: 'underline'}}
                />
            <CheckBox 
                    selected={criarContaCheckTermoDadosPessoais} 
                    onPressCheck={()=>{setCriarContaCheckTermoDadosPessoais(!criarContaCheckTermoDadosPessoais)}}
                    onPressText={toggleOverlayTermoDadosPessoaisVisibility}
                    text={
`Aceito os termos de consentimento 
para tratamento de dados pessoais`}
                    style={{marginTop: 10}}
                    textStyle={{fontSize: 15, color:'white', textDecorationLine: 'underline'}}
                />
          </View>
                              
          <View style={styles.overlay_criar_conta_view_button} onTouchEnd={CriarConta}>
            <Text style={{textAlign: 'center', fontSize: 25, fontWeight: 'bold'}}>Criar conta</Text>
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

      <Overlay isVisible={overlayTermosDeUsoAlunoVisibility} overlayStyle={styles.overlay_criar_conta}>
        <Provider>
          <View style={styles.overlay_criar_conta_view_titulo}>
            <View style={{flex: 1}}>
              <MaterialIcon name='arrow-back' size={35} onPress={toggleOverlayTermosDeUsoAlunoVisibility}/>
            </View>
          </View>
          
          
          <View style={styles.overlay_criar_conta_view_dados}>
            <ScrollView> 
              <Text style={{color: 'white'}}>
  {`TERMOS DE USO

1. Relacionamento Contratual
Estes termos de uso regem seu acesso e uso, como pessoa física, dentro do Brasil, de aplicativos, sites de Internet, conteúdos, bens e também serviços disponibilizados pela SPEED DRIVE., com sede no Brasil no endereço Av Barão de Mauá n 3126 CNPJ 34946445/0001-80.

POR FAVOR, LEIA COM ATENÇÃO ESTES TERMOS ANTES DE ACESSAR OU USAR OS SERVIÇOS.

Ao acessar e usar os Serviços você concorda com os presentes termos e condições, que estabelecem o relacionamento contratual entre você, na qualidade de usuário(a), e a Speed Drive. Se você não concorda com estes Termos, você não pode acessar nem usar os Serviços. A Speed Drive poderá imediatamente encerrar estes Termos ou quaisquer Serviços em relação a você ou, de modo geral, deixar de oferecer ou negar acesso aos Serviços ou a qualquer parte deles, a qualquer momento e por qualquer motivo.
Termos adicionais poderão se aplicar a determinados Serviços, tais como condições para um evento, atividade ou promoção em particular, e esses termos adicionais serão divulgados em relação aos respectivos Serviços. Termos adicionais são complementares e considerados parte integrante destes Termos para os efeitos dos respectivos Serviços. Termos adicionais prevalecerão sobre estes Termos em caso de conflito com relação aos referidos Serviços.
A Speed Drive poderá alterar os Termos relativos aos Serviços a qualquer momento. Aditamentos entrarão em vigor quando a Speed Drive fizer a postagem da versão atualizada dos Termos neste local ou das condições atualizadas ou Termos adicionais sobre o respectivo Serviço. O fato de você continuar a acessar ou usar os Serviços após essa postagem representa seu consentimento em vincular-se aos Termos alterados.
A Speed Drive é a controladora dos dados pessoais coletados em conexão com o uso dos Serviços no Brasil. Os seus dados pessoais são transferidos para os bancos de dados e cadastros da Speed Drive com base em mecanismos aprovados sob as leis aplicáveis, e a coleta e utilização pela Speed Drive de dados pessoais associados aos Serviços são feitas de acordo com o Aviso de Privacidade da Speed Drive.

2. Os Serviços
Os Serviços integram uma plataforma de tecnologia que permite aos(às) Usuários(as) de aplicativos móveis ou sites de Internet da Speed Drive, fornecidos como parte dos Serviços (cada qual um “Aplicativo”), solicitar e programar serviços de treinamento para habilitados com terceiros independentes provedores desses serviços, mediante contrato com a Speed Drive ou com determinadas afiliadas da Speed Drive (“Parceiros Independentes”). A menos que diversamente acordado pela Speed Drive em contrato escrito celebrado em separado com você, os Serviços são disponibilizados para seu uso pessoal e não comercial. VOCÊ RECONHECE QUE OS SERVIÇOS OFERTADOS SÃO PRESTADOS POR PARCEIROS INDEPENDENTES, QUE NÃO SÃO EMPREGADOS(AS) E NEM REPRESENTANTES DA SPEED DRIVE, NEM DE QUALQUER DE SUAS AFILIADAS.
Licença.
Sujeito ao cumprimento destes Termos, a Speed Drive outorga a você uma licença limitada, não exclusiva, não passível de sublicença, revogável e não transferível para: (i) acesso e uso dos Aplicativos em seu dispositivo pessoal, exclusivamente para o seu uso dos Serviços; e (ii) acesso e uso de qualquer conteúdo, informação e material correlato que possa ser disponibilizado por meio dos Serviços, em cada caso, para seu uso pessoal, nunca comercial. Quaisquer direitos não expressamente outorgados por estes Termos são reservados à Speed Drive e suas afiliadas licenciadoras.
Restrições.
Você não poderá: (i) remover qualquer aviso de direito autoral, direito de marca ou outro aviso de direito de propriedade de qualquer parte dos Serviços; (ii) reproduzir, modificar, preparar obras derivadas, distribuir, licenciar, locar, vender, revender, transferir, exibir, veicular, transmitir ou, de qualquer outro modo, explorar os Serviços, exceto da forma expressamente permitida pela Speed Drive; (iii) decompilar, realizar engenharia reversa ou desmontar os Serviços, exceto conforme permitido pela legislação aplicável; (iv) conectar, espelhar ou recortar qualquer parte dos Serviços; (v) fazer ou lançar quaisquer programas ou scripts com a finalidade de sobrecarregar ou prejudicar indevidamente a operação e/ou funcionalidade de qualquer aspecto dos Serviços; ou (vi) tentar obter acesso não autorizado aos Serviços ou prejudicar qualquer aspecto dos Serviços ou seus sistemas ou redes correlatas.
Prestação dos Serviços.
Você reconhece que os Serviços podem ser disponibilizados sob diferentes marcas da Speed Drive ou diferentes opções de solicitação associadas aos serviços de treinamento para habilitados prestados por Parceiros.
Serviços e Conteúdo de Terceiros(as).
Os Serviços poderão ser disponibilizados e acessados em conexão com Serviços e conteúdo de terceiros(as) (inclusive publicidade) que a Speed Drive não controlará. VOCÊ RECONHECE QUE TERMOS DE USO E POLÍTICAS DE PRIVACIDADE DIFERENTES PODERÃO SER APLICÁVEIS AO USO DESSES SERVIÇOS E CONTEÚDO DE TERCEIROS(AS). A SPEED DRIVE NÃO ENDOSSA ESSES SERVIÇOS E CONTEÚDO DE TERCEIROS(AS) E A SPEED DRIVE NÃO SERÁ, EM HIPÓTESE ALGUMA, RESPONSÁVEL POR NENHUM PRODUTO OU SERVIÇO DESSES(AS) TERCEIROS(AS) FORNECEDORES(AS). Além disto, Apple Inc., Google, Inc., Microsoft Corporation ou BlackBerry Limited e/ou suas subsidiárias e afiliadas internacionais serão terceiros(as) beneficiários(as) deste Contrato, caso você acesse os Serviços usando aplicativos desenvolvidos para dispositivos móveis baseados em Apple iOS, Android, Microsoft Windows, ou Blackberry, respectivamente. Esses(as) terceiros(as) beneficiários(as) não são partes deste Contrato e não são responsáveis pela prestação dos Serviços ou por qualquer forma de suporte aos Serviços. Seu acesso aos Serviços usando esses dispositivos está sujeito às condições estabelecidas nos termos de serviços dos respectivos terceiros(as) beneficiários(as).
Titularidade.
Os Serviços e todos os direitos sobre eles são e permanecerão de propriedade da Speed Drive ou de propriedade das afiliadas da Speed Drive, ou de suas respectivas licenciadoras, conforme o caso. Estes Termos e o uso dos Serviços não lhe outorgam nem lhe conferem qualquer direito: (i) sobre os Serviços, exceto pela licença limitada concedida acima; ou (ii) de usar ou, de qualquer modo, fazer referência a nomes societários, logotipos, nomes de produtos ou de Serviços, marcas comerciais ou marcas de serviço da Speed Drive ou de qualquer licenciadora da Speed Drive.

3. Uso dos Serviços
Contas de Usuários.
Para utilizar grande parte dos Serviços, você deve registrar-se e manter uma conta pessoal de usuário de Serviços (“Conta”). Você deve ter pelo menos 18 anos para registrar uma Conta. Usuários com idade igual ou superior a 12 anos poderão registrar-se e manter uma Conta desde que tenham sido devidamente representados ou tenham obtido o consentimento de seu(s) responsável(is) legal(is), conforme o procedimento para registro aplicável em cada caso. O registro de Conta exige que a Speed Drive colete determinados dados pessoais, que podem incluir seu nome, endereço, número de telefone celular e data de nascimento, assim como pelo menos um método de pagamento válido (cartão de crédito ou parceiro de pagamento aceito pela Speed Drive). Você concorda em manter informações corretas, completas e atualizadas em sua Conta. Se você não mantiver informações corretas, completas e atualizadas em sua Conta, inclusive se o método de pagamento informado for inválido ou expirado, você poderá ficar impossibilitado(a) de acessar e usar os Serviços ou a Speed Drive poderá resolver estes Termos. Você é responsável por todas as atividades realizadas na sua Conta e concorda em manter sempre a segurança e confidencialidade do nome de usuário e senha da sua Conta. A menos que diversamente permitido pela Speed Drive por escrito, você poderá manter apenas uma Conta.
Conduta e Obrigações do Usuário.
Você não poderá autorizar terceiros(as) a usar sua Conta ou receber serviços de treinamento para habilitados dos Parceiros Independentes, salvo se estiverem em sua companhia. Você não poderá ceder, nem de qualquer outro modo transferir, sua Conta a nenhuma outra pessoa ou entidade. Você concorda em cumprir todas as leis aplicáveis quando usar os Serviços e que somente poderá usar os Serviços para finalidades legítimas (por ex. não transportar materiais ilegais ou perigosos). Você não poderá, quando usar os Serviços, causar transtorno, aborrecimento, inconveniente ou danos à propriedade dos Parceiros Independentes ou de qualquer outro terceiro. Em determinadas situações, você poderá ser solicitado(a) a fornecer comprovante de identidade para acessar ou usar os Serviços, e concorda que poderá ter seu acesso ou uso dos Serviços negado caso você se recuse a fornecer um comprovante de identidade e, ainda, por ser um serviço de treinamento para habilitados, será exigida a apresentação de sua CNH válida como termo condicionante a assumir a direção do veículo.
Mensagem de Texto (SMS).
Ao criar uma Conta, você concorda que os Serviços poderão lhe enviar mensagens de textos (SMS) como parte das operações comerciais regulares para o uso dos Serviços. Você poderá optar por não receber mensagens de texto (SMS) da Speed Drive a qualquer momento. Você reconhece que optar por não receber as mensagens de texto poderá prejudicar o seu uso dos Serviços.
Códigos Promocionais.
A Speed Drive poderá, a seu exclusivo critério, criar códigos promocionais que poderão ser resgatados para crédito na Conta ou outras características ou benefícios relacionados aos Serviços e/ou a serviços de Parceiros Independentes, sujeitos a quaisquer condições adicionais que a Speed Drive estabelecer para cada um dos códigos promocionais. Você concorda que Códigos Promocionais: (i) devem ser usados de forma legal para a finalidade e o público a que se destinam; (ii) não devem ser duplicados, de qualquer forma vendidos, transferidos ou disponibilizados ao público em geral (seja por meio de postagem ao público ou qualquer outro método), a menos que expressamente permitido pela Speed Drive; (iii) poderão ser desabilitados pela Speed Drive a qualquer momento por motivos legalmente legítimos, sem que disto resulte qualquer responsabilidade para a Speed Drive; (iv) somente poderão ser usados de acordo com as condições específicas que a Speed Drive estabelecer para esses Código Promocional; (v) não são válidos como dinheiro; e (vi) poderão expirar antes de serem usados. A Speed Drive se reserva o direito de reter ou deduzir créditos ou outras funcionalidades ou vantagens obtidas por meio do uso dos Códigos Promocionais por você ou por outro usuário, caso a Speed Drive apure ou acredite que o uso ou resgate do Código Promocional foi feito com erro, fraude, ilegalidade ou violação às condições do respectivo Código Promocional.
Conteúdo Fornecido pelo(a) Usuário(a).
A Speed Drive poderá, a seu exclusivo critério, permitir que você ou qualquer pessoa apresente, carregue, publique ou, de qualquer modo, disponibilize para a Speed Drive por meio dos Serviços, conteúdo e informações de texto, áudio ou vídeo, inclusive comentários e feedbacks relacionados aos Serviços, iniciação de solicitação de suporte e registro em concursos e promoções. Qualquer Conteúdo de Usuário(a) fornecido por você permanece de sua propriedade. Contudo, ao fornecer Conteúdo de Usuário(a) para a Speed Drive, você outorga a Speed Drive e suas afiliadas uma licença dos direitos autorais sobre o Conteúdo de Usuário em nível mundial, perpétua, irrevogável, transferível, isenta de royalties, e com direito a sublicenciar, usar, copiar, modificar, criar obras derivadas, distribuir, publicar, exibir, executar em público e, de qualquer outro modo, explorar esse Conteúdo de Usuário(a) em todos os formatos e canais de distribuição hoje conhecidos ou desenvolvidos no futuro (inclusive em conexão com os Serviços e com os negócios da Speed Drive e em sites e Serviços de terceiros), sem ulterior aviso a você ou seu consentimento, e sem necessidade de pagamento a você ou a qualquer outra pessoa ou entidade. 
Você declara e garante que: (i) é o(a) único(a) e exclusivo(a) proprietário(a) de todo Conteúdo de Usuário(a) ou tem todos os direitos, licenças, autorizações e permissões necessários para outorgar à Speed Drive a licença sobre o Conteúdo de Usuário(a) acima referido; e (ii) nem o Conteúdo de Usuário(a) nem sua apresentação, carregamento, publicação ou outra forma de disponibilização desse Conteúdo de Usuário(a), tampouco o uso do Conteúdo de Usuário(a) pela Speed drive da forma aqui permitida, infringirão, constituirão apropriação indevida nem violarão propriedade intelectual ou direito de propriedade de terceiros(a), nem direitos de publicidade ou privacidade e também não resultarão na violação de qualquer lei ou regulamento aplicável.
Você concorda em não fornecer Conteúdo de Usuário(a) que seja difamatório, calunioso, injurioso, violento, obsceno, pornográfico, ilegal ou de qualquer modo ofensivo, conforme apuração da Speed Drive a seu critério exclusivo, seja ou não esse material protegido por lei. A Speed Drive poderá, mas não está obrigada a analisar, monitorar ou remover Conteúdo de Usuário(a), a critério exclusivo da Speed Drive, a qualquer momento e por qualquer motivo, sem nenhum aviso a você.
Acesso à Rede e Equipamentos.
Você é responsável por obter o acesso a rede de dados necessário para usar os Serviços. As taxas e encargos de sua rede de dados e mensagens poderão se aplicar se você acessar ou usar os Serviços de um dispositivo sem fio e você será responsável por essas taxas e encargos. Você é responsável por adquirir e atualizar os equipamentos e dispositivos necessários para acessar e usar os Serviços e Aplicativos e quaisquer de suas atualizações. A SPEED DRIVE NÃO GARANTE QUE OS SERVIÇOS, OU QUALQUER PARTE DELES, FUNCIONARÃO EM QUALQUER EQUIPAMENTO OU DISPOSITIVO EM PARTICULAR. Além disso, os Serviços poderão estar sujeitos a mau funcionamento e atrasos inerentes ao uso da Internet e de comunicações eletrônicas.

4. Pagamento
Você entende que os serviços ou bens que você receber de um Parceiro Independente, contratados por meio dos Serviços, poderão ser cobrados (“Preço”). Antes de você ter recebido serviços ou bens obtidos por meio do uso do Serviço, a Speed Drive facilitará o seu pagamento do respectivo Preço ao Parceiro Independente, agindo na qualidade de agente limitado de cobrança do Parceiro Independente. O pagamento do Preço feito dessa maneira será considerado pagamento feito diretamente por você ao Parceiro Independente. O preço incluirá todos os tributos exigidos por lei.
O preço pago por você é final e não reembolsável, a menos que diversamente determinado pela Speed Drive. Você tem o direito de solicitar uma redução no Preço ao Parceiro Independente por serviços ou bens recebidos desse Parceiro Independente no momento em que receber esses serviços ou bens. A Speed Drive responderá de acordo com qualquer solicitação de Parceiro Independente para modificar o Preço de um serviço ou bem em particular. Na máxima extensão permitida pela lei aplicável, a Speed Drive reserva o direito de limitar os Preços cobrados em espécie. Uma vez limitado o valor a ser pago em espécie, você deverá disponibilizar um método alternativo de pagamento. Nas hipóteses em que o pagamento em espécie for um método de pagamento aceito, você poderá escolher receber eventuais valores devidos pelo Parceiro Independente a título de troco na forma de créditos Speed Drive Cash, que poderão ser utilizados para pagamento em novas solicitações de Serviços.
O preço total é devido e deve ser pago imediatamente antes da prestação do serviço ou entrega do bem pelo Parceiro Independente e o pagamento será facilitado pela Speed Drive mediante o método de pagamento indicado na sua Conta, após o que a Speed Drive enviará um recibo por e-mail. Se for verificado que o método de pagamento indicado na Conta expirou, é inválido ou não pode ser cobrado, você concorda que a Speed Drive poderá, na qualidade de agente limitado de cobrança do Parceiro Independente, usar um método secundário de cobrança na Conta, se houver.
Na relação entre você e a Speed Drive, a Speed Drive reserva-se o direito de estabelecer, remover e/ou revisar o Preço relativo a todos os serviços ou bens obtidos por meio do uso dos Serviços a qualquer momento, a critério exclusivo da Speed Drive. Ademais, você reconhece e concorda que o Preço aplicável em certas áreas geográficas poderá (i) incluir cobranças, tarifas, taxas, impostos e/ou contribuições governamentais devidas em seu nome, inclusive, tarifas de pedágios ou cobranças de aeroportos, conforme a rota tomada pelo Parceiro Independente, o local de origem e/ou destino da viagem ou, e legislação aplicável e, (ii) aumentar substancialmente quando a oferta de serviços por parte dos Parceiros Independentes for menor do que a demanda por referidos serviços. O pagamento de taxas, impostos e/ou contribuições governamentais, serão de sua responsabilidade e você reembolsará o Parceiro Independente e/ou a Speed Drive por todas as tarifas, taxas, impostos e/ou contribuições governamentais pagas em seu nome. Para mais detalhes sobre aumento de Preço em decorrência de aumento substancial da demanda, acesse o sítio da Speed Drive na internet. A Speed Drive envidará esforços razoáveis para informá-lo dos Preços que poderão se aplicar, sendo certo que você será responsável pelo pagamento dos Preços lançados em sua Conta independentemente de estar ciente desses Preços ou de seus valores. A Speed Drive poderá, a qualquer momento, fornecer a certos(as) usuários(as) ofertas e descontos promocionais que poderão resultar em valores diferentes cobrados por Serviços iguais ou similares a outros obtidos por meio do uso dos Serviços, e você concorda que essas ofertas e descontos promocionais, a menos que também oferecidos a você, não terão influência sobre os Preços aplicados. Você poderá optar por cancelar sua solicitação de serviços ou bens de um Parceiro Independente a qualquer momento antes da chegada desse Parceiro Independente, caso em que poderá incidir uma taxa de cancelamento.
Esta estrutura de pagamento se destina a remunerar integralmente os Parceiros Independentes pelos serviços ou bens disponibilizados a você. A Speed Drive não indica nenhuma parcela do pagamento como valor extra ou gratificação aos Parceiros Independentes. Qualquer declaração da Speed Drive (no website da Speed Drive, no Aplicativo ou nos materiais de marketing da Speed Drive) de que o pagamento de valores extras são “voluntários”, “não obrigatórios” e/ou “não incluídos” no pagamento que você faz pelos serviços ou bens prestados não pretende sugerir que a Speed Drive oferece valores adicionais àqueles descritos acima aos Parceiros Independentes. Você compreende e concorda que, embora você seja livre para fazer pagamentos adicionais como valor extra a quaisquer Parceiros Independentes que forneça serviços ou bens por meio dos Serviços, você não tem obrigação de fazê-lo. Valores extras são de caráter voluntário. Após ter recebido os serviços ou bens obtidos por meio dos Serviços, você terá a oportunidade de avaliar sua experiência e fazer comentários adicionais sobre o Parceiro Independente.
Taxa de Reparos ou Limpeza.
Você será responsável pelos custos de reparos a danos ou pela limpeza de veículos de Parceiros Independentes resultantes do uso dos Serviços por meio da sua Conta que excedam os danos naturais decorrentes do uso (“Reparos ou Limpeza”). Caso um Parceiro Independente relate a necessidade de Reparos ou Limpeza e essa solicitação de Reparos ou Limpeza seja confirmada pela Speed Drive, a critério razoável da Speed Drive, a Speed Drive reserva-se o direito de facilitar o pagamento desses Reparos ou Limpeza em nome do Parceiro Independente usando o método de pagamento indicado em sua Conta. Referidos valores serão transferidos pela Speed Drive ao respectivo Parceiro Independente e não serão reembolsáveis.

5. Recusa de Garantia; Limitação de Responsabilidade; Indenização.
Recusa de Garantia.
OS SERVIÇOS SÃO PRESTADOS “NO ESTADO” E “COMO DISPONÍVEIS”. A SPEED DRIVE RECUSA TODAS AS DECLARAÇÕES E GARANTIAS, EXPRESSAS, IMPLÍCITAS OU LEGAIS, NÃO EXPRESSAMENTE CONTIDAS NESTES TERMOS, INCLUSIVE AS GARANTIAS IMPLÍCITAS DE COMERCIALIZAÇÃO, ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA E NÃO INFRINGÊNCIA. ADEMAIS, A SPEED DRIVE NÃO FAZ NENHUMA DECLARAÇÃO NEM DÁ GARANTIA SOBRE A CONFIABILIDADE, PONTUALIDADE, QUALIDADE, ADEQUAÇÃO OU DISPONIBILIDADE DOS SERVIÇOS OU DE QUAISQUER SERVIÇOS OU BENS SOLICITADOS POR MEIO DO USO DOS SERVIÇOS, NEM QUE OS SERVIÇOS SERÃO ININTERRUPTOS OU LIVRES DE ERROS. A SPEED DRIVE NÃO GARANTE A QUALIDADE, ADEQUAÇÃO, SEGURANÇA OU HABILIDADE DE PARCEIROS INDEPENDENTES. VOCÊ CONCORDA QUE TODO O RISCO DECORRENTE DO USO DOS SERVIÇOS E DE QUALQUER SERVIÇO OU BEM SOLICITADO POR MEIO DA TECNOLOGIA SERÁ SEMPRE SEU NA MÁXIMA MEDIDA PERMITIDA PELA LEI APLICÁVEL.
Limitação de Responsabilidade.
A SPEED DRIVE NÃO SERÁ RESPONSÁVEL POR DANOS INDIRETOS, INCIDENTAIS, ESPECIAIS, PUNITIVOS OU EMERGENTES, INCLUSIVE LUCROS CESSANTES, PERDA DE DADOS, DANOS MORAIS OU PATRIMONIAIS RELACIONADOS, ASSOCIADOS OU DECORRENTES DE QUALQUER USO DOS SERVIÇOS AINDA QUE A SPEED DRIVE TENHA SIDO ALERTADA PARA A POSSIBILIDADE DESSES DANOS. A SPEED DRIVE NÃO SERÁ RESPONSÁVEL POR NENHUM DANO, OBRIGAÇÃO OU PREJUÍZO DECORRENTE DO: (i) SEU USO DOS SERVIÇOS OU SUA INCAPACIDADE DE ACESSAR OU USAR OS SERVIÇOS; OU (ii) QUALQUER OPERAÇÃO OU RELACIONAMENTO ENTRE VOCÊ E QUALQUER PARCEIRO INDEPENDENTE, AINDA QUE A SPEED DRIVE TENHA SIDO ALERTADA PARA A POSSIBILIDADE DESSES DANOS. A SPEED DRIVE NÃO SERÁ RESPONSÁVEL POR ATRASOS OU FALHAS DECORRENTES DE CAUSAS FORA DO CONTROLE RAZOÁVEL DA SPEED DRIVE E, TAMPOUCO, PELA QUALIDADE E INTEGRIDADE DOS BENS DISPONIBILIZADOS POR PARCEIROS INDEPENDENTES.
AS LIMITAÇÕES E RECUSA DE GARANTIAS CONTIDAS NESTA CLÁUSULA 5 NÃO POSSUEM O OBJETIVO DE LIMITAR RESPONSABILIDADES OU ALTERAR DIREITOS DE CONSUMIDOR QUE, DE ACORDO COM A LEI APLICÁVEL, NÃO PODEM SER LIMITADOS OU ALTERADOS.
Seguro de Acidentes Pessoais.
VOCÊ RECONHECE QUE A SPEED DRIVE MANTÉM SEGURO DE ACIDENTES PESSOAIS DE HABILITADOS EM TREINAMENTO, COM COBERTURA, NOS TERMOS E LIMITES DA APÓLICE, PARA REEMBOLSO DE DESPESAS MÉDICO-HOSPITALARES, INVALIDEZ PERMANENTE TOTAL OU PARCIAL POR ACIDENTE E MORTE ACIDENTAL, DESDE QUE EM TREINAMENTO REGULAR PELA PLATAFORMA, E QUE EVENTUAL PAGAMENTO DE INDENIZAÇÃO PELA SEGURADORA A VOCÊ SERÁ FEITO SEM QUALQUER ASSUNÇÃO DE RESPONSABILIDADE PELA SPEED DRIVE E SERÁ DEDUZIDO DE QUALQUER EVENTUAL FUTURA OUTRA INDENIZAÇÃO RECLAMADA DECORRENTE DAQUELE MESMO INCIDENTE.
As informações sobre o Seguro de Acidentes Pessoais de Passageiros podem ser acessadas no sítio da internet da Speed Drive.
Indenização.
Você concorda em indenizar e manter a Speed Drive, seus diretores(as), conselheiros(as), empregados(as) e agentes isentos(as) de responsabilidade por todas e quaisquer reclamações, cobranças, prejuízos, responsabilidades e despesas (inclusive honorários advocatícios) decorrentes ou relacionados: (i) ao uso dos Serviços, de serviços ou bens obtidos por meio do uso dos Serviços; (ii) descumprimento ou violação de qualquer disposição destes Termos; (iii) o uso, pela Speed Drive, do Conteúdo de Usuário(a); ou (iv) violação dos direitos de terceiros, inclusive Parceiros Independentes.

6. SOLUÇÃO DE CONTROVÉRSIAS
A Speed Drive disponibiliza uma estrutura de atendimento, composta por ferramentas de contato e uma equipe especializada de suporte para o tratamento de reclamações com o objetivo de evitar a judicialização de controvérsias que, eventualmente, possam surgir com o seu uso dos Serviços.
Diante disso, você se compromete a utilizar as ferramentas de suporte disponibilizadas pela Speed Drive como primeiro meio para a solução de controvérsias decorrentes do seu uso dos Serviços.
Você também poderá buscar a solução de controvérsias por meio do serviço www.consumidor.gov.br, mantido pela Secretaria Nacional do Consumidor (SENACON) do Ministério da Justiça e Segurança Pública, que é disponibilizado gratuitamente aos consumidores de todo o país com o objetivo de prevenir e reduzir a quantidade de controvérsias judicializadas.

7. Legislação Aplicável; Jurisdição.
Estes Termos serão regidos e interpretados exclusivamente de acordo com as leis do Brasil. Qualquer reclamação, conflito ou controvérsia que surgir deste contrato ou a ele relacionada, inclusive que diga respeito a sua validade, interpretação ou exequibilidade, será solucionada exclusivamente pelos tribunais do foro de seu domicílio.

8. Outras Disposições
Alegações de Violação de Direito Autoral.
Alegações de violação de direito autoral devem ser encaminhadas ao representante indicado pela Speed Drive. Consulte a página de Internet da Speed Drive para obter o endereço indicado e outras informações.
Avisos.
A Speed Drive poderá enviar avisos por meio de notificações gerais nos Serviços, correio eletrônico para seu endereço de e-mail em sua Conta, ou por comunicação escrita enviada ao endereço indicado em sua Conta. Você poderá notificar a Speed Drive por meio do Aplicativo, comunicação pelo endereço eletrônico no site.
Disposições Gerais.
Você não poderá ceder, nem tampouco transferir estes Termos, total ou parcialmente, sem prévia aprovação por escrito da Speed Drive. Você concorda que a Speed Drive ceda e transfira estes Termos, total ou parcialmente, inclusive: (i) para uma subsidiária ou afiliada; (ii) um adquirente das participações acionárias ou de cotas empresariais, negócios ou bens da Speed Drive; ou (iii) para um sucessor em razão de qualquer operação societária. Não existe joint-venture, sociedade, emprego ou relação de representação entre você, a Speed Drive ou quaisquer Parceiros Independentes como resultado do contrato entre você e a Speed Drive ou pelo uso dos Serviços.
Caso qualquer disposição destes Termos seja tida como ilegal, inválida ou inexequível total ou parcialmente, por qualquer legislação, essa disposição ou parte dela será, naquela medida, considerada como não existente para os efeitos destes Termos, mas a legalidade, validade e exequibilidade das demais disposições contidas nestes Termos não serão afetadas. Nesse caso, as partes substituirão a disposição ilegal, inválida ou inexequível, ou parte dela, por outra que seja legal, válida e exequível e que, na máxima medida possível, tenha efeito similar à disposição tida como ilegal, inválida ou inexequível para fins de conteúdo e finalidade dos presentes Termos. Estes Termos constituem a totalidade do acordo e entendimento das partes sobre este assunto. Nestes Termos, as palavras “inclusive” e “inclui” significam “incluindo, sem limitação”.
`}
              </Text>
            </ScrollView> 
          </View>
          
                              
          <View style={styles.overlay_termo_de_uso_view_button} onTouchEnd={toggleOverlayTermosDeUsoAlunoVisibility}>
            <Text style={{textAlign: 'center', fontSize: 25, fontWeight: 'bold'}}>Ok</Text>
          </View>

        </Provider>
      </Overlay>

      <Overlay isVisible={overlayTermosDeUsoInstrutorVisibility} overlayStyle={styles.overlay_criar_conta}>
        <Provider>
          <View style={styles.overlay_criar_conta_view_titulo}>
            <View style={{flex: 1}}>
              <MaterialIcon name='arrow-back' size={35} onPress={toggleOverlayTermosDeUsoInstrutorVisibility}/>
            </View>
          </View>
          
          
          <View style={styles.overlay_criar_conta_view_dados}>
            <ScrollView> 
              <Text style={{color: 'white'}}>
  {`TERMOS E CONDIÇÕES DE CONTRATO PARA INSTRUTOR AUTÔNOMO PARA HABILITADOS ATRAVÉS DO APLICATIVO SPEED DRIVE


Prestação de serviço autônomo de instrutor de trânsito para motoristas habilitados.

DA CONTRATAÇÃO

Cláusula Primeira: Fica acordado entre as partes que não há vínculo empregatício entre o instrutor autônomo e a Speed Drive.

DESCRIÇÃO DA CONTRATAÇÃO E DA PRESTAÇÃO DO SERVIÇO

Cláusula segunda: Ficam as partes esclarecidas que a Speed Drive é detentora de um aplicativo para celular e tablets que oferece o serviço de contratação de aulas avulsas de direção em trânsito para motoristas e que funciona da seguinte maneira: 
a)	A cliente baixa o aplicativo da Speed Drive para seu celular, realiza um cadastro, e através desse aplicativo tem a opção de a qualquer dia dentro dos horários das (06:00 as 22:00) contratar o serviço de aula de trânsito para habilitado;
b)	Assim que o cliente acionar o serviço o instrutor autônomo cadastrado previamente no aplicativo poderá atender a chamada e ir ao encontro do cliente para imediatamente iniciar a prestação do serviço contratado;
c)	O tempo de duração da aula/instrução para o cliente habilitado poderá ser escolhido pelo cliente no aplicativo e a instrução poderá ser de direção em trânsito, baliza ou ambos;
d)	O cliente poderá pagar através do aplicativo da Speed Drive e este repassar ao instrutor o valor acordado ou o cliente poderá optar em pagar em dinheiro, se assim o for, o instrutor deverá repassar para a Speed Drive o percentual devido, ou ficando o instrutor com todo o valor pago pelo cliente a Speed Drive descontará este valor dos Créditos em dinheiro que o instrutor tiver para receber da Speed Drive;
e)	Os pagamentos dos Créditos serão pagos aos instrutores da seguinte forma: (somada às aulas dadas de segunda a sexta feira será feito um depósito em conta cadastrada pelo parceiro da Speed Drive);

DAS CONDIÇÕES PARA CADASTRO E PRESTAÇÃO DE SERVIÇOS 

Cláusula terceira: Ao se cadastrar no Aplicativo Speed Drive será exigido do instrutor para habilitado: Foto da carteira de motorista, comprovante de endereço, foto do documento do veículo que será cadastrado para a prestação do serviço.
Parágrafo primeiro: A carteira de motorista não poderá estar vencida, cassada ou suspensa, sob pena de não conseguir se cadastrar, o mesmo vale para o documento do veículo cadastrado que não poderá estar vencido o seu licenciamento.
Parágrafo segundo: O instrutor ao se cadastrar deverá apresentar sua documentação de instrutor em dia (que não esteja vencida) além de cumprir outras exigências constantes no cadastro.
Parágrafo terceiro: em caso de vencida a carteira de motorista, documento do veículo ou documentos para o exercício da profissão de instrutor o cadastro do instrutor junto a Speed Drive poderá ser suspenso e em caso de suspenção do direito de dirigir, o cadastro do instrutor será cancelado.
Parágrafo quarto: O instrutor que deseja prestar serviços também poderá se cadastrar através do sítio da internet da Speed Drive.
Cláusula quarta: O carro cadastrado pelo instrutor deverá estar em plenas condições de uso para o devido fim (de instrução de trânsito) e estar dentro dos padrões necessários apontados para cadastro.
Cláusula quinta: Não haver qualquer vínculo empregatício entre a Speed Drive e o Instrutor cadastrado, o aplicativo da Speed Drive é tão somente uma plataforma facilitadora em que podem se cadastrar (cumprindo os requisitos fixados pela Speed Drive) instrutores autônomos e clientes em busca do serviço de Instrução de Trânsito.
Cláusula sexta: A Speed Drive não se responsabiliza por eventuais danos provocado aos veículos cadastrados, a seus instrutores ou tomadores do serviço, portanto fica a critério do Instrutor obter um seguro para o seu veículo que cubram eventuais danos.
Parágrafo primeiro: Havendo eventual dano ao veículo por culpa do contratante que está recebendo a instrução de trânsito, ambos, instrutor e condutor deverão entrar em acordo para a reparação do dano.
Cláusula sétima: Caso o cliente acione o aplicativo Speed Drive para contratar o serviço e o instrutor aceite o serviço havendo desistência por parte do cliente este pagará uma taxa de desistência que será repassada ao instrutor nos termos da cláusula segunda alínea “e”.
Parágrafo Primeiro: Caso a desistência descrita na cláusula sétima seja por parte do instrutor que aceitou o serviço este poderá receber uma advertência e na terceira desistência poderá ter seu cadastro cancelado, salvo comprovado motivo de caso fortuito ou força maior, através de peticionário para comprovação feito por e-mail ou através do site da Speed Drive, no prazo de até 15 dias corridos após a desistência.
Parágrafo segundo: Uma equipe da Speed Drive analisará os comprovantes e decidirá se os motivos são válidos ou não segundo critérios predefinidos. Estes critérios poderão ser encontrados no site da Speed Drive.
Cláusula oitava: sempre que um cliente cadastrado contratar o serviço através do aplicativo Speed Drive os instrutores cadastrados receberão um alerta com as informações necessárias para aceitar ou não o serviço, em caso de recusa este deverá informar através do aplicativo o motivo da recusa.
Parágrafo primeiro: a informação da recusa poderá ser por escrito em um campo próprio ou através de um questionário disponibilizado pelo aplicativo.

DO COMPROMISSO DO INSTRUTOR COM A SPEED DRIVE E COM OS CLIENTES

Cláusula nona: Ao se cadastrar no aplicativo Speed Drive o Instrutor se compromete com a prática dos bons costumes morais e éticos, com o respeito aos clientes agindo de forma estritamente profissional, com o respeito a legislação de trânsito brasileiro.
Parágrafo primeiro: Não serão tolerados assédios aos clientes e condutas em desacordo com a moral a ética e as leis, sob pena de cancelamento do cadastro do Instrutor sem prejuízo de eventual responsabilização cível e/ou criminal.

CLÁUSULAS GERAIS

Cláusula décima: Fica eleita o foro da comarca da sede da Speed Drive para soluções de controvérsias ou eventual ação judicial ou extrajudicial para resolução de conflitos.
Cláusula décima primeira: Estes Termos serão regidos e interpretados exclusivamente de acordo com as leis do Brasil. Qualquer reclamação, conflito ou controvérsia que surgir deste contrato ou a ele relacionada, inclusive que diga respeito a sua validade, interpretação ou exequibilidade, será solucionada exclusivamente no foro da comarca da sede da Speed Drive.
Cláusula décima segunda: A Speed Drive poderá enviar avisos por meio de notificações gerais nos Serviços, correio eletrônico para seu endereço de e-mail em sua Conta, ou por comunicação escrita enviada ao endereço indicado em sua Conta. Você poderá notificar a Speed Drive por meio do Aplicativo, comunicação pelo endereço eletrônico no site.
Cláusula décima terceira:  Caso qualquer disposição destes Termos seja tida como ilegal, inválida ou inexequível total ou parcialmente, por qualquer legislação, essa disposição ou parte dela será, naquela medida, considerada como não existente para os efeitos destes Termos, mas a legalidade, validade e exequibilidade das demais disposições contidas nestes Termos não serão afetadas. Nesse caso, as partes substituirão a disposição ilegal, inválida ou inexequível, ou parte dela, por outra que seja legal, válida e exequível e que, na máxima medida possível, tenha efeito similar à disposição tida como ilegal, inválida ou inexequível para fins de conteúdo e finalidade dos presentes Termos. Estes Termos constituem a totalidade do acordo e entendimento das partes sobre este assunto. Nestes Termos, as palavras “inclusive” e “inclui” significam “incluindo, sem limitação”.
Cláusula décima quinta: Você concorda em indenizar e manter a Speed Drive, seus diretores(as), conselheiros(as), empregados(as) e agentes isentos(as) de responsabilidade por todas e quaisquer reclamações, cobranças, prejuízos, responsabilidades e despesas (inclusive honorários advocatícios) decorrentes ou relacionados: (i) ao uso dos Serviços, de serviços ou bens obtidos por meio do uso dos Serviços; (ii) descumprimento ou violação de qualquer disposição destes Termos; (iii) o uso, pela Speed Drive, do Conteúdo de Usuário(a); ou (iv) violação dos direitos de terceiros, inclusive Parceiros Independentes.

DISPOSIÇÕES FINAIS

Cláusula Décima sexta: A Speed Drive não será responsável por danos indiretos, incidentais, especiais, punitivos ou emergentes, inclusive lucros cessantes, perda de dados, danos morais ou patrimoniais relacionados, associados ou decorrentes de qualquer uso dos serviços ainda que a Speed Drive tenha sido alertada para a possibilidade desses danos. A Speed Drive não será responsável por nenhum dano, obrigação ou prejuízo do seu uso dos serviços ou a incapacidade de acessar ou usar os serviços, ou qualquer operação ou relacionamento entre o Instrutor e o aluno, ainda que a Speed Drive tenha sido alertada para a possibilidade desses danos. A Speed Drive não será responsável por falhas decorrentes de causas fora do controle da Speed Drive. 

Cláusula décima sétima: Você é responsável por obter o acesso a rede de dados necessário para usar os Serviços. As taxas e encargos de sua rede de dados e mensagens poderão se aplicar se você acessar ou usar os Serviços de um dispositivo sem fio e você será responsável por essas taxas e encargos. Você é responsável por adquirir e atualizar os equipamentos e dispositivos necessários para acessar e usar os Serviços e Aplicativos e quaisquer de suas atualizações. A SPEED DRIVE NÃO GARANTE QUE OS SERVIÇOS, OU QUALQUER PARTE DELES, FUNCIONARÃO EM QUALQUER EQUIPAMENTO OU DISPOSITIVO EM PARTICULAR. Além disso, os Serviços poderão estar sujeitos a mau funcionamento e atrasos inerentes ao uso da Internet e de comunicações eletrônicas.

Cláusula décima oitava: o Instrutor deverá acessar constantemente o site da Speed Drive na internet para obter informações adicionais do contrato e outras informações importantes, as informações poderão ser enviadas para os e-mails e/ou telefones cadastrados dos instrutores, como também o aviso de que existem novas informações no site poderá chegar através do aplicativo da Speed Drive.

Ao dar o aceite o instrutor concorda com este contrato.


O Foro da Sede da Speed Drive é o foro eleito para resolução de conflitos.

`}
              </Text>
            </ScrollView> 
          </View>
          
                              
          <View style={styles.overlay_termo_de_uso_view_button} onTouchEnd={toggleOverlayTermosDeUsoInstrutorVisibility}>
            <Text style={{textAlign: 'center', fontSize: 25, fontWeight: 'bold'}}>Ok</Text>
          </View>

        </Provider>
      </Overlay>

      <Overlay isVisible={overlayTermoDadosPessoaisVisibility} overlayStyle={styles.overlay_criar_conta}>
        <Provider>
          <View style={styles.overlay_criar_conta_view_titulo}>
            <View style={{flex: 1}}>
              <MaterialIcon name='arrow-back' size={35} onPress={toggleOverlayTermoDadosPessoaisVisibility}/>
            </View>
          </View>
          
          
          <View style={styles.overlay_criar_conta_view_dados}>
            <ScrollView> 
              <Text style={{color: 'white'}}>
  {`TERMO DE CONSENTIMENTO PARA TRATAMENTO DE DADOS PESSOAIS

Autorizo a Speed Drive, CNPJ nº 34946445/0001-80 , denominada de CONTROLADORA, a utilizar meus dados cadastrais (pois sou TITULAR dos dados fornecidos) que passarão a constar em seus bancos de dados para o que segue:

Finalidade

Permitir que a Controladora identifique e entre em contato comigo, em razão do contrato de contratos específicos;
Para cumprimento de obrigações decorrentes da legislação brasileira;
Para cumprimento, pela Controladora, de obrigações impostas por órgãos de fiscalização;
Quando necessário para a executar um contrato, no qual seja parte o titular;
A pedido do titular dos dados;
Para o exercício regular de direitos em processo judicial ou extrajudicial;
Para a proteção da vida ou da incolumidade física do titular ou de terceiros;
Para a tutela da saúde, exclusivamente, em procedimento realizado por profissionais de saúde, serviços de saúde ou autoridade sanitária;
Quando necessário para atender aos interesses legítimos do controlador ou de terceiros, exceto no caso de prevalecerem direitos e liberdades fundamentais do titular que exijam a proteção dos dados pessoais;
Caso seja necessário o compartilhamento de dados com terceiros que não tenham sido relacionados nesse termo ou qualquer alteração contratual posterior, será ajustado novo termo de consentimento para este fim, conforme disposto em Lei.
Em caso de alteração na finalidade, que esteja em desacordo com o consentimento original, a Controladora deverá comunicar o Titular, que poderá revogar o consentimento, conforme previsto na cláusula sexta.

Compartilhamento
A Controladora fica autorizada a compartilhar os dados pessoais do Titular com outros agentes de tratamento de dados, caso seja necessário para as finalidades listadas neste instrumento, desde que, sejam respeitados os princípios da boa-fé, finalidade, adequação, necessidade, livre acesso, qualidade dos dados, transparência, segurança, prevenção, não discriminação e responsabilização e prestação de contas.

Responsabilidade pela Segurança dos Dados
A Controladora se responsabiliza por manter medidas de segurança, técnicas e administrativas suficientes a proteger os dados pessoais do Titular e à Autoridade Nacional de Proteção de Dados (ANPD), comunicando ao Titular, caso ocorra algum incidente de segurança que possa acarretar risco ou dano relevante, conforme artigo 48 da Lei n° 13.709/2020.

Término do Tratamento dos Dados
À Controladora, é permitido manter e utilizar os dados pessoais do Titular durante todo o período contratualmente firmado para as finalidades relacionadas nesse termo e ainda após o término da contratação para cumprimento de obrigação legal ou impostas por órgãos de fiscalização, nos termos da Lei.

Direito de Revogação do Consentimento
O Titular poderá revogar seu consentimento, a qualquer tempo, por e-mail ou por carta escrita.
O Titular fica ciente de que a Controladora poderá permanecer utilizando os dados para as seguintes finalidades:
Para cumprimento, pela Controladora, de obrigações impostas por órgãos de fiscalização;
Para o exercício regular de direitos em processo judicial ou extrajudicial;
Para a proteção da vida ou da incolumidade física do titular ou de terceiros;
Para a tutela da saúde, exclusivamente, em procedimento realizado por profissionais de saúde, serviços de saúde ou autoridade sanitária;
Quando necessário para atender aos interesses legítimos do controlador ou de terceiros, exceto no caso de prevalecerem direitos e liberdades fundamentais do titular que exijam a proteção dos dados pessoais.

Tempo de Permanência dos Dados Recolhidos
O titular fica ciente de que a Controladora deverá permanecer com os seus dados pelo período mínimo de guarda de documentos conforme disposição em lei.

Vazamento de Dados ou Acessos Não Autorizados – Penalidades
As partes poderão entrar em acordo, quanto aos eventuais danos causados, caso exista o vazamento de dados pessoais ou acessos não autorizados, e caso não haja acordo, a Controladora tem ciência que estará sujeita às penalidades previstas em Lei.
`}
              </Text>
            </ScrollView> 
          </View>
          
                              
          <View style={styles.overlay_termo_de_uso_view_button} onTouchEnd={toggleOverlayTermoDadosPessoaisVisibility}>
            <Text style={{textAlign: 'center', fontSize: 25, fontWeight: 'bold'}}>Ok</Text>
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
            <Text style={{fontSize: 16, marginBottom: 15, color: 'white'}} >Enviaremos instruções para que você possa recuperar sua conta</Text>
            <TextInputNativePaper theme={theme} label="E-mail" value={esqueciSenhaEmail} onChangeText={text => setEsqueciSenhaEmail(text)}/>
          </View>
                              
          <View style={styles.overlay_esqueci_senha_view_button} onTouchEnd={EsqueciSenha}>
            <Text style={{textAlign: 'center', fontSize: 25, fontWeight: 'bold'}}>Recuperar conta</Text>
          </View>
        </Provider>
      </Overlay>

      

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
    height: 665,
    width: 355,
    borderRadius: 8,
    backgroundColor: '#212F3C',
    marginBottom: 70,
  },

  overlay_esqueci_senha: {
    height: 250,
    width: 325,
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

  overlay_termo_de_uso_view_button:{
    flex: 1.5,
    backgroundColor: '#064c7a',
    margin: -10,
    borderBottomStartRadius: 8,
    borderBottomEndRadius: 8,
    justifyContent: 'center',  
    marginTop: 20,
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
