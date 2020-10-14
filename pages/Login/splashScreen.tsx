import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_900Black_Italic } from '@expo-google-fonts/roboto';
import AsyncStorage from '@react-native-community/async-storage';
import * as userLib from '../../lib/user.ts'

const  SplashScreen = () => {

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

  const usuarioEstaAutenticado = async () => {
    const dadosUsuario = await userLib.getUserAuthData();
    console.log(dadosUsuario)
    if (dadosUsuario != undefined)
      return true
    else
      return false
  }

  useEffect(() => {
    setTimeout(async () => {
      if (await usuarioEstaAutenticado())
        handleNavigateToDashboard()
      else
        handleNavigateToOnboarding()
    }, 3000);
    
  }, [])

  while (!fontsLoaded) {
    return <View />;
  }

  return (
    <KeyboardAvoidingView style={styles.container_principal}>
      <View style={styles.view_splash}>
        <Text style={styles.Titulo}>SPEED DRIVE</Text>
        <Text style={styles.DescricaoMaior}>Treinamento para habilitados</Text>
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
    alignItems: 'center'
  },

  Titulo: {
    fontSize: 45,
    fontFamily: 'Roboto_500Medium',
    color: "#C80000",
    marginBottom: 10
  },

  DescricaoMaior: {
    fontSize: 25,
    fontFamily: 'Roboto_500Medium',
    color: '#F7C700',
  },  
});
