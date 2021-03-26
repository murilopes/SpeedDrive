import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_900Black_Italic } from '@expo-google-fonts/roboto';
import * as userLib from '../../lib/user'
import ConfigFile from "../../config.json"
import axios from "axios";

const  SplashScreen = () => {

  const navigation = useNavigation();

  const [count, setCount] = React.useState(0)

  function handleNavigateToOnboarding() {
    navigation.navigate('Onboarding');
  }

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

  const API = axios.create({
    baseURL: ConfigFile.API_SERVER_URL,
  });

  const ValidaToken = async (token: string) => {

    var userData = { token };
    
    try {
      const resp = await API.post('/auth/validaToken', userData)
      if(resp.status == 200)
        return true        

    } catch (error) {
      return false
    }
  }

  const usuarioEstaAutenticado = async () => {
    const rawDadosUsuario = await userLib.getUserAuthData();
    if (rawDadosUsuario != undefined) {
      const { token, id } = JSON.parse(rawDadosUsuario)
      return await ValidaToken(token) && id != undefined && id != '' ? true : false
    }      
    else
      return false
  }

  navigation.addListener('focus', () => {
    setCount(count+1)
  })

  useEffect(() => {
    setTimeout(async () => {
      if (await usuarioEstaAutenticado()) {
        const {tipoUsuario} = JSON.parse(await userLib.getUserAuthData())
        if (tipoUsuario == 'aluno') handleNavigateToAlunoDashboard()
        if (tipoUsuario == 'instrutor') handleNavigateToInstrutorDashboard()
        if (tipoUsuario == 'admin') handleNavigateToAdminDashboard()
      }        
      else
        handleNavigateToOnboarding()
    }, 3000);
    
  }, [count])

  while (!fontsLoaded) {
    return <View />;
  }

  return (
    <KeyboardAvoidingView style={styles.container_principal}>
      <View style={styles.view_splash}>
        <View style={styles.view_interna}>
          <Text style={styles.Titulo}>SPEED DRIVE</Text>
          <Image source={require('../../assets/cth.png')} resizeMode='center'></Image>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default SplashScreen;

const styles = StyleSheet.create({

  container_principal: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },

  view_splash: {
    alignItems: 'center',
  },

  view_interna: {
    alignItems: 'center',
  },

  Titulo: {
    fontSize: 55,
    fontFamily: 'Roboto_500Medium',
    color: "#C80000",
  },

  DescricaoMaior: {
    fontSize: 25,
    fontFamily: 'Roboto_500Medium',
    color: '#F7C700',
  },  
});
