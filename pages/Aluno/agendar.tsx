import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, TextInput, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Appbar, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RectButton } from 'react-native-gesture-handler';

const  AlunoAgendar = () => {

  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack()
  }
  

  return (
    <KeyboardAvoidingView style={styles.container_principal} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

      <Appbar.Header statusBarHeight={-15} style={{height: 45, backgroundColor: '#212F3C'}}>
        <Appbar.Action icon="arrow-left-circle" size={30} onPress={_goBack} />
        <Appbar.Content title="Agendamento" />
      </Appbar.Header>

      <ScrollView>        
        
      </ScrollView>
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

})