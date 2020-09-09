import React, {useState, useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';

const  AlunoCadastro = () => {

  const navigation = useNavigation();

  const _goBack = () => {
    navigation.goBack()
  }

  return (<View/>)
}

export default AlunoCadastro;