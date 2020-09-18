import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_900Black_Italic } from '@expo-google-fonts/roboto';

const  Login = () => {

  const navigation = useNavigation();

  function handleNavigateToOnboarding() {
    navigation.navigate('Onboarding');
  }

  function handleNavigateToDashboard() {
    navigation.navigate('AlunoDashboard');
  }

  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_900Black_Italic
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  while (!fontsLoaded) {
    return <View />;
  }

  return (
    <KeyboardAvoidingView style={styles.container_principal} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

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
          <RectButton style={styles.button} onPress={handleNavigateToDashboard}>
              <View style={styles.buttonIcon}>
                <Feather name="play" color="#fff" size={24} />
              </View>
              <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
          <RectButton style={styles.button} onPress={handleNavigateToOnboarding}>
              <View style={styles.buttonIcon}>
                <Feather name="plus" color="#fff" size={24} />
              </View>
              <Text style={styles.buttonText}>Criar conta</Text>
          </RectButton>
          <RectButton style={styles.buttonSemFundo}>
              <View style={styles.buttonIcon}>
                <Feather name="slack" color="#fff" size={24} />
              </View>
              <Text style={styles.buttonText}>Esqueci minha senha</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

export default Login;

const styles = StyleSheet.create({
  container_principal: {
    flex: 1,
    backgroundColor: 'black',
    alignContent: 'center',
    paddingTop: 40
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
});
