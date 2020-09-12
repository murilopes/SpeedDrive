import React, {useState, useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { ProgressBar, Colors } from 'react-native-paper';
import { Appbar, Avatar } from 'react-native-paper';

const  AlunoCadastro = () => {

  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack()
  }

  return (
    <KeyboardAvoidingView style={styles.container_principal} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        <Appbar.Header statusBarHeight={-15} style={{height: 45, backgroundColor: '#212F3C'}}>
          <Appbar.Action icon="arrow-left-circle" size={30} onPress={_goBack} />
          <Appbar.Content title="Cadastro" />
        </Appbar.Header>

      
    </KeyboardAvoidingView>
    )
}

export default AlunoCadastro;


const styles = StyleSheet.create({
  container_principal: {
    flex: 1,
    backgroundColor: 'black',
    alignContent: 'center',
    paddingTop: 40
  },
})